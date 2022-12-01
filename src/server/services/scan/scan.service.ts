import { router, publicProcedure } from '../../trpc';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

export type Scan = Prisma.ScanGetPayload<{
  select: { [K in keyof Required<Prisma.ScanSelect>]: true };
}>;

export type ScanTypes = 'Add Funding' | 'Redemption' | 'Withdrawl';

export type ScanStates = 'Scanned' | 'Confirmed' | 'Failed';

class ScanService {
  public static ScanSelect = Prisma.validator<Prisma.ScanSelect>()({
    id: true,
    scannerId: true,
    faucetId: true,
    faucetAddress: true,
    message: true,
    state: true,
    type: true,
    ref: true,
    tokenMint: true,
    tokenMintAmount: true,
    signature: true,
    createdAt: true,
    updatedAt: true,
  });

  public get router() {
    return router({
      create: this.create,
      update: this.update,
      list: this.list,
      find: this.find,
    });
  }

  appCaller: any = null;

  public setAppCaller = (caller: any) => {
    this.appCaller = caller;
  };

  /*============================================================================
   * Create Scan
   ============================================================================*/

  public createInput = z.object({
    scannerId: z.string(),
    faucetId: z.string(),
    faucetAddress: z.string(),
    message: z.string(),
    state: z.string(),
    type: z.string(),
    ref: z.string(),
    tokenMint: z.string().nullable(),
    tokenMintAmount: z.string().nullable(),
    signature: z.string().nullable(),
  });

  public create = publicProcedure
    .input(this.createInput)
    .mutation(async ({ input }) => {
      const scan = await prisma.scan.create({
        data: input,
        select: ScanService.ScanSelect,
      });

      /**
       * Start polling for the transaction to be confirmed
       */

      if (scan.state === 'Scanned') {
        this.appCaller.task.create({
          scanId: scan.id,
          ref: scan.ref,
          type: 'Confirm Transaction',
        });
      }

      return scan;
    });

  /*============================================================================
 * Update Scan
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
        orderBy: { createdAt: 'desc' },
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
