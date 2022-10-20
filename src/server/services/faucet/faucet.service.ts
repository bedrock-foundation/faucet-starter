import { router, publicProcedure } from '../../trpc';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { TRPCError } from '@trpc/server';
import SecretKeyUtil from '~/server/utils/SecretKeyUtil';

// const appRouter = router({
//   file: fileService.router,
// });

// const caller = appRouter.createCaller({});

export type Faucet = Prisma.FaucetGetPayload<{
  select: { [K in keyof Required<Prisma.FaucetSelect>]: true };
}>;

class FaucetService {
  public static FaucetSelect = Prisma.validator<Prisma.FaucetSelect>()({
    id: true,
    address: true,
    createdAt: true,
    updatedAt: true,
  });

  public get router() {
    return router({
      initialize: this.initialize,
      get: this.get,
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
}

export default new FaucetService();
