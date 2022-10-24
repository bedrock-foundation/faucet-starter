import { router, publicProcedure } from '../../trpc';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { TRPCError } from '@trpc/server';
import SecretKeyUtil from '~/server/utils/SecretKeyUtil';
import RPCConnection from '~/server/utils/RPCConnection';
import { PublicKey } from '@solana/web3.js';
import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import TokenUtil, { TokenBalance } from '~/shared/utils/TokenUtil';
import scanService, { Scan, ScanStates, ScanTypes } from '../scan/scan.service';

const caller = router({
  scan: scanService.router,
}).createCaller({});

export type Faucet = Prisma.FaucetGetPayload<{
  select: { [K in keyof Required<Prisma.FaucetSelect>]: true };
}>;

export enum FaucetStatus {
  Unfunded = 'Unfunded',
  Active = 'Active',
}

export type FaucetAnalytics = {
  faucetId: string;
  uniqueAccounts: number;
  redemptions: number;
  tokensRedeemed: TokenBalance[];
  balances: TokenBalance[];
};

class FaucetService {
  public static FaucetSelect = Prisma.validator<Prisma.FaucetSelect>()({
    id: true,
    address: true,
    tokenMint: true,
    tokenMintAmount: true,
    createdAt: true,
    updatedAt: true,
  });

  public get router() {
    return router({
      initialize: this.initialize,
      get: this.get,
      balance: this.balance,
      analytics: this.analytics,
    });
  }

  /*============================================================================
   * Initialize
   ============================================================================*/

  public initializeInput = z.object({});

  public initialize = publicProcedure
    .input(this.initializeInput)
    .mutation(async () => {
      const [existingFaucet] = await prisma.faucet.findMany({
        select: FaucetService.FaucetSelect,
      });

      if (existingFaucet) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Faucet has already been initialize',
        });
      }

      const faucetKeyPair = await SecretKeyUtil.faucetSecretKey();
      const pubkey = faucetKeyPair?.publicKey.toBase58();

      if (!pubkey) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No pubkey for faucet initialization found',
        });
      }

      const faucet = await prisma.faucet.create({
        data: {
          address: pubkey,
        },
        select: FaucetService.FaucetSelect,
      });
      return faucet;
    });

  /*============================================================================
   * Get Faucet
   ============================================================================*/
  public getInput = z.object({});

  public get = publicProcedure.input(this.getInput).query(async () => {
    const [faucet] = await prisma.faucet.findMany({
      select: FaucetService.FaucetSelect,
    });

    return faucet ?? null;
  });

  /*============================================================================
   * Faucet Balance
   ============================================================================*/
  public balanceInput = z.object({});

  public balance = publicProcedure.input(this.balanceInput).query(async () => {
    const [faucet] = await prisma.faucet.findMany({
      select: FaucetService.FaucetSelect,
    });

    if (!faucet) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Faucet has not been initialized',
      });
    }

    const pubkey = new PublicKey(faucet.address);

    const tokenAccounts = await RPCConnection.getTokenAccountsByOwner(pubkey, {
      programId: TOKEN_PROGRAM_ID,
    });

    const balances: TokenBalance[] = tokenAccounts.value.map((raw) => {
      const { amount, mint } = AccountLayout.decode(raw.account.data);
      return {
        mint: mint.toBase58(),
        amount: amount.toString(),
        info: TokenUtil.tokenInfoMap.get(mint.toBase58()) ?? null,
      };
    });

    return balances;
  });

  /*============================================================================
   * Faucet Analaytics
   ============================================================================*/
  public analyticsInput = z.object({});

  public analytics = publicProcedure
    .input(this.analyticsInput)
    .query(async (args) => {
      const [faucet] = await prisma.faucet.findMany({
        select: FaucetService.FaucetSelect,
      });

      if (!faucet) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Faucet has not been initialized',
        });
      }

      const balances = await this.router.createCaller(args).balance({});

      const scans: Scan[] = await caller.scan.list({ faucetId: faucet.id });

      const { accounts, redemptions, tokensRedeemed } = scans.reduce(
        (cur, next) => {
          const states: ScanStates[] = ['Confirmed', 'Scanned'];

          const types: ScanTypes[] = ['Redemption'];

          if (
            states.includes(next.state as ScanStates) &&
            types.includes(next.type as ScanTypes)
          ) {
            cur.accounts.push(next.scannerId);
            cur.redemptions++;
            cur.tokensRedeemed = [];
            // cur.tokensRedeemed = next.balanceChanges.reduce(
            //   (curTokenBalances, nextTokenBalance) => {
            //     const index = curTokenBalances.findIndex(
            //       (tokenBalance) => tokenBalance.mint === nextTokenBalance.mint,
            //     );

            //     if (index > -1) {
            //       curTokenBalances[index].amount =
            //         BigInt(curTokenBalances[index].amount) +
            //         BigInt(nextTokenBalance.amount);
            //     } else {
            //       curTokenBalances.push(nextTokenBalance);
            //     }
            //     return curTokenBalances;
            //   },
            //   cur.tokensRedeemed,
            // );
          }

          return cur;
        },
        {
          accounts: [] as string[],
          redemptions: 0,
          tokensRedeemed: [],
        },
      );

      /**
       * Get unique accounts
       */
      const uniqueAccounts = [...new Set(accounts)].length;

      const analytics: FaucetAnalytics = {
        faucetId: faucet.id,
        uniqueAccounts,
        redemptions,
        tokensRedeemed,
        balances,
      };

      return analytics;
    });
}

export default new FaucetService();
