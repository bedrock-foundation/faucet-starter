import { router, publicProcedure } from '../../trpc';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { TRPCError } from '@trpc/server';
import SecretKeyUtil from '~/server/utils/SecretKeyUtil';
import RPCConnection from '~/server/utils/RPCConnection';
import {
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import TokenUtil, { TokenBalance } from '~/shared/utils/TokenUtil';
import scanService, { Scan, ScanStates, ScanTypes } from '../scan/scan.service';
import TransferUtil from '~/server/utils/TransferUtil';

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

/**
 * Create a caller to call our other services
 */

const caller = router({ scan: scanService.router }).createCaller({});

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
      update: this.update,
      get: this.get,
      balance: this.balance,
      analytics: this.analytics,
      fund: this.fund,
      redeem: this.redeem,
      withdraw: this.withdraw,
    });
  }

  /*============================================================================
   * Initialize Faucet
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
          tokenMint: '3BRtC2VUpFdcw5QdhBSjXGVtGjac43bpDCeszK3H8mk7',
          tokenMintAmount: '1',
        },
        select: FaucetService.FaucetSelect,
      });
      return faucet;
    });

  /*============================================================================
 * Update Faucet
 ============================================================================*/

  public updateInput = z.object({
    tokenMint: z.string(),
    tokenMintAmount: z.string(),
  });

  public update = publicProcedure
    .input(this.updateInput)
    .mutation(async ({ input: { tokenMint, tokenMintAmount } }) => {
      const [existingFaucet] = await prisma.faucet.findMany({
        select: FaucetService.FaucetSelect,
      });

      if (!existingFaucet) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Faucet has not been initialized',
        });
      }

      const faucet = await prisma.faucet.update({
        where: { id: existingFaucet?.id },
        data: {
          tokenMint,
          tokenMintAmount,
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
    .query(async () => {
      const [faucet] = await prisma.faucet.findMany({
        select: FaucetService.FaucetSelect,
      });

      if (!faucet) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Faucet has not been initialized',
        });
      }

      const balances = await this.router.createCaller({}).balance({});

      const scans: Scan[] = await caller.scan.list({
        faucetId: faucet.id,
      });

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

            const index = cur.tokensRedeemed.findIndex(
              (tokenBalance) => tokenBalance.mint === next.tokenMint,
            );

            if (index > -1) {
              const newAmount = String(
                BigInt(cur.tokensRedeemed?.[index]?.amount ?? '0') +
                  BigInt(next?.tokenMintAmount ?? '0'),
              );

              /**
               * TODO: Figure out how to type this properly
               */
              (cur.tokensRedeemed[index] as any).amount = newAmount;
            } else {
              const info = TokenUtil.tokenInfoMap.get(next?.tokenMint ?? '');
              cur.tokensRedeemed.push({
                mint: next.tokenMint ?? '',
                amount:
                  TokenUtil.convertSizeToQuantity(
                    next.tokenMintAmount ?? '',
                    next.tokenMint ?? '',
                    info,
                  ) ?? '',
                info: info ?? null,
              });
            }
          }

          return cur;
        },
        {
          accounts: [] as string[],
          redemptions: 0,
          tokensRedeemed: [] as TokenBalance[],
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

  /*============================================================================
  * Fund Faucet
  ============================================================================*/
  public fundInput = z.object({
    account: z.string(),
    redemptions: z.string(),
  });

  public fund = publicProcedure
    .input(this.fundInput)
    .query(async ({ input: { account, redemptions } }) => {
      /**
       * Get the faucet
       */
      const [faucet] = await prisma.faucet.findMany({
        select: FaucetService.FaucetSelect,
      });

      if (!faucet) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Faucet has not been initialized',
        });
      }

      /**
       * Create ref to track the transaction
       */

      const ref = Keypair.generate().publicKey;

      try {
        /**
         * Get the secret key for the faucet
         */
        const faucetKey = await SecretKeyUtil.faucetSecretKey();
        if (!faucetKey) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Could not find secret key for faucet.',
          });
        }

        /**
         * Create the transaction
         */
        const ixs: TransactionInstruction[] = [];
        const funderPublicKey = new PublicKey(account);

        const tokenInfo = TokenUtil.tokenInfoMap.get(faucet.tokenMint);
        const qty =
          TokenUtil.convertSizeToQuantity(
            String(BigInt(faucet.tokenMintAmount)),
            faucet.tokenMint,
            tokenInfo,
          ) ?? '0';

        const transferIxs = await TransferUtil.transferSPLToken({
          fromAccountPublicKey: funderPublicKey,
          toAccountPublicKey: faucetKey.publicKey,
          splTokenPublicKey: new PublicKey(faucet.tokenMint),
          amount: String(BigInt(qty) * BigInt(redemptions)),
          feePayerPublicKey: funderPublicKey,
          refs: [ref],
        });

        ixs.push(...transferIxs);

        const tx = new Transaction().add(...ixs);

        tx.feePayer = funderPublicKey;

        tx.recentBlockhash = (
          await RPCConnection.getLatestBlockhash('finalized')
        ).blockhash;

        /**
         * Here we serialize and deserialize the tx
         * as a workaround for this isue
         * https://github.com/solana-labs/solana/issues/21722
         */
        const orderedTx = Transaction.from(
          tx.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          }),
        );

        const txBuffer = orderedTx.serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        });

        /**
         * Create successful scan
         */

        caller.scan.create({
          scannerId: account,
          faucetId: faucet.id,
          faucetAddress: faucet.address,
          message: 'Waiting for confirmation',
          state: 'Scanned' as ScanStates,
          type: 'Add Funding' as ScanTypes,
          ref: String(ref),
          tokenMint: faucet.tokenMint,
          tokenMintAmount: faucet.tokenMintAmount,
          signature: null,
        });

        return {
          transaction: txBuffer,
          message: 'Confirm to add funds.',
        };
      } catch (e: any) {
        /**
         * Create failure scan
         */
        caller.scan.create({
          scannerId: account,
          faucetId: faucet.id,
          faucetAddress: faucet.address,
          message: e.message,
          state: 'Failed' as ScanStates,
          type: 'Add Funding' as ScanTypes,
          ref: String(ref),
          tokenMint: null,
          tokenMintAmount: null,
          signature: null,
        });

        throw e;
      }
    });

  /*============================================================================
  * Redeem Faucet
  ============================================================================*/
  public redeemInput = z.object({
    account: z.string(),
  });

  public redeem = publicProcedure
    .input(this.redeemInput)
    .query(async (args) => {
      const {
        input: { account },
      } = args;
      /**
       * Get the faucet
       */
      const [faucet] = await prisma.faucet.findMany({
        select: FaucetService.FaucetSelect,
      });

      if (!faucet) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Faucet has not been initialized',
        });
      }

      /**
       * Create ref to track the transaction
       */

      const ref = Keypair.generate().publicKey;

      try {
        /**
         * Get the secret key for the faucet
         */
        const faucetKey = await SecretKeyUtil.faucetSecretKey();
        if (!faucetKey) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Could not find secret key for faucet.',
          });
        }

        const tokenInfo = TokenUtil.tokenInfoMap.get(faucet.tokenMint);
        const qty =
          TokenUtil.convertSizeToQuantity(
            String(BigInt(faucet.tokenMintAmount)),
            faucet.tokenMint,
            tokenInfo,
          ) ?? '0';

        /**
         * Create the transaction
         */
        const ixs: TransactionInstruction[] = [];
        const redeemerPublicKey = new PublicKey(account);

        const transferIxs = await TransferUtil.transferSPLToken({
          fromAccountPublicKey: faucetKey.publicKey,
          toAccountPublicKey: redeemerPublicKey,
          splTokenPublicKey: new PublicKey(faucet.tokenMint),
          amount: qty,
          feePayerPublicKey: redeemerPublicKey,
          refs: [ref],
        });

        ixs.push(...transferIxs);

        const tx = new Transaction().add(...ixs);

        tx.feePayer = redeemerPublicKey;

        tx.recentBlockhash = (
          await RPCConnection.getLatestBlockhash('finalized')
        ).blockhash;

        /**
         * Here we serialize and deserialize the tx
         * as a workaround for this isue
         * https://github.com/solana-labs/solana/issues/21722
         */
        const orderedTx = Transaction.from(
          tx.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          }),
        );

        /**
         * Partial sign the transaction
         */

        orderedTx.partialSign(faucetKey);

        const txBuffer = orderedTx.serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        });

        /**
         * Create successful scan
         */
        caller.scan.create({
          scannerId: account,
          faucetId: faucet.id,
          faucetAddress: faucet.address,
          message: 'Waiting for confirmation',
          state: 'Scanned' as ScanStates,
          type: 'Redemption' as ScanTypes,
          ref: String(ref),
          tokenMint: faucet.tokenMint,
          tokenMintAmount: faucet.tokenMintAmount,
          signature: null,
        });

        return {
          transaction: txBuffer,
          message: 'Confirm to redeem.',
        };
      } catch (e: any) {
        /**
         * Create failure scan
         */
        caller.scan.create({
          scannerId: account,
          faucetId: faucet.id,
          faucetAddress: faucet.address,
          message: e.message,
          state: 'Failed' as ScanStates,
          type: 'Redemption' as ScanTypes,
          ref: String(ref),
          tokenMint: null,
          tokenMintAmount: null,
          signature: null,
        });

        throw e;
      }
    });
  /*============================================================================
  * Withdraw Faucet
  ============================================================================*/
  public withdrawInput = z.object({
    account: z.string(),
  });

  public withdraw = publicProcedure
    .input(this.withdrawInput)
    .query(async (args) => {
      const {
        input: { account },
      } = args;
      /**
       * Get the faucet
       */
      const [faucet] = await prisma.faucet.findMany({
        select: FaucetService.FaucetSelect,
      });

      if (!faucet) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Faucet has not been initialized',
        });
      }

      /**
       * Create ref to track the transaction
       */

      const ref = Keypair.generate().publicKey;

      try {
        /**
         * Get the secret key for the faucet
         */
        const faucetKey = await SecretKeyUtil.faucetSecretKey();
        if (!faucetKey) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Could not find secret key for faucet.',
          });
        }

        /**
         * Get Faucet Balance
         */
        const balances = await this.router.createCaller(args).balance({});
        const tokenBalance = balances.find(
          (balance) => balance.mint === faucet.tokenMint,
        );

        if (!tokenBalance || Number(tokenBalance.amount) === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'This faucet does not have a balance of the token mint.',
          });
        }

        /**
         * Create the transaction
         */
        const ixs: TransactionInstruction[] = [];
        const withdrawerPublicKey = new PublicKey(account);

        const transferIxs = await TransferUtil.transferSPLToken({
          fromAccountPublicKey: faucetKey.publicKey,
          toAccountPublicKey: withdrawerPublicKey,
          splTokenPublicKey: new PublicKey(faucet.tokenMint),
          amount: tokenBalance.amount,
          feePayerPublicKey: withdrawerPublicKey,
          refs: [ref],
        });

        ixs.push(...transferIxs);

        const tx = new Transaction().add(...ixs);

        tx.feePayer = withdrawerPublicKey;

        tx.recentBlockhash = (
          await RPCConnection.getLatestBlockhash('finalized')
        ).blockhash;

        /**
         * Here we serialize and deserialize the tx
         * as a workaround for this isue
         * https://github.com/solana-labs/solana/issues/21722
         */
        const orderedTx = Transaction.from(
          tx.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          }),
        );

        /**
         * Partial sign the transaction
         */

        orderedTx.partialSign(faucetKey);

        const txBuffer = orderedTx.serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        });

        /**
         * Create successful scan
         */

        caller.scan.create({
          scannerId: account,
          faucetId: faucet.id,
          faucetAddress: faucet.address,
          message: 'Waiting for confirmation',
          state: 'Scanned' as ScanStates,
          type: 'Withdrawl' as ScanTypes,
          ref: String(ref),
          tokenMint: faucet.tokenMint,
          tokenMintAmount: TokenUtil.convertQuantityToSize(
            tokenBalance.amount,
            faucet.tokenMint,
          ),
          signature: null,
        });

        return {
          transaction: txBuffer,
          message: 'Confirm to withdraw funds.',
        };
      } catch (e: any) {
        /**
         * Create failure scan
         */
        caller.scan.create({
          scannerId: account,
          faucetId: faucet.id,
          faucetAddress: faucet.address,
          message: e.message,
          state: 'Failed' as ScanStates,
          type: 'Withdrawl' as ScanTypes,
          ref: String(ref),
          tokenMint: null,
          tokenMintAmount: null,
          signature: null,
        });

        throw e;
      }
    });
}

export default new FaucetService();
