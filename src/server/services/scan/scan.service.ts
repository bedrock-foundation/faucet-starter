import { router, publicProcedure } from '../../trpc';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

// const appRouter = router({
//   file: fileService.router,
// });

// const caller = appRouter.createCaller({});

export type Scan = Prisma.ScanGetPayload<{
  select: { [K in keyof Required<Prisma.ScanSelect>]: true };
}> & {
  type: ScanTypes;
  state: ScanStates;
};

export type ScanTypes = 'AddFunding' | 'Redemption' | 'Withdrawl';

export type ScanStates = 'Scanned' | 'Confirmed' | 'Failed';

class ScanService {
  public static ScanSelect = Prisma.validator<Prisma.ScanSelect>()({
    id: true,
    scannerId: true,
    faucetId: true,
    faucetAddress: true,
    message: true,
    state: true,
    ref: true,
    tokenMint: true,
    tokenMintAmount: true,
    mint: true,
    signature: true,
    createdAt: true,
    updatedAt: true,
  });

  public get router() {
    return router({
      create: this.create,
      get: this.list,
      find: this.find,
    });
  }

  /*============================================================================
   * Create
   ============================================================================*/

  public createInput = z.object({
    id: z.string(),
    scannerId: z.string(),
    faucetId: z.string(),
    faucetAddress: z.string(),
    message: z.string(),
    state: z.string(),
    ref: z.string(),
    tokenMint: z.string().nullable(),
    tokenMintAmount: z.string().nullable(),
    mint: z.string().nullable(),
    signature: z.string().nullable(),
  });

  public create = publicProcedure
    .input(this.createInput)
    .mutation(async ({ input }) => {
      const scan = await prisma.scan.create({
        data: input,
        select: ScanService.ScanSelect,
      });

      if (scan.state === 'Scanned') {
        // Timer here
      }

      return scan;
    });

  /*============================================================================
 * Update
 ============================================================================*/

  public updateInput = z.object({
    id: z.string(),
    message: z.string(),
    state: z.string(),
    signature: z.string().nullable(),
  });

  public update = publicProcedure
    .input(this.updateInput)
    .mutation(async ({ input }) => {
      const scan = await prisma.scan.update({
        where: { id: input.id },
        data: input,
        select: ScanService.ScanSelect,
      });

      return scan;
    });

  /*============================================================================
   * List Scans
   ============================================================================*/
  public listInput = z.object({
    faucetId: z.string(),
  });

  public list = publicProcedure
    .input(this.listInput)
    .query(async ({ input: { faucetId } }) => {
      const scans = await prisma.scan.findMany({
        where: { faucetId },
        select: ScanService.ScanSelect,
      });

      return scans;
    });

  /*============================================================================
   * Find Scans
   ============================================================================*/
  public findInput = z.object({
    faucetId: z.string(),
    scannerId: z.string(),
  });

  public find = publicProcedure
    .input(this.findInput)
    .query(async ({ input }) => {
      const scans = await prisma.scan.findMany({
        where: input,
        select: ScanService.ScanSelect,
      });

      return scans;
    });
}

export default new ScanService();
