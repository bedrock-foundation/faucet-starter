import { router, publicProcedure } from '../../trpc';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

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
      create: this.create,
      get: this.get,
    });
  }

  /*============================================================================
   * Create Faucet
   ============================================================================*/

  public createInput = z.object({
    id: z.string().uuid().optional(),
    address: z.string(),
  });

  public create = publicProcedure
    .input(this.createInput)
    .mutation(async ({ input }) => {
      const { id, address } = input;

      const faucet = await prisma.faucet.create({
        data: {
          id,
          address,
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
