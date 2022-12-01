import { router, publicProcedure } from '../../trpc';
import { z } from 'zod';
import RPCConnection from '~/server/utils/RPCConnection';
import { PublicKey } from '@solana/web3.js';
import { Job, Queue, Worker } from 'bullmq';

const REDIS_CONNECTION_STRING = '';

export type TaskTypes = 'Confirm Transaction';

type TaskData = {
  type: TaskTypes;
  scanId: string;
  ref: string;
};

const TASK_QUEUE_NAME = 'faucet-tasks';

// const redisUrl = new URL(REDIS_CONNECTION_STRING);

// const connection = {
//   host: redisUrl.hostname,
//   port: parseInt(redisUrl.port, 10),
//   username: redisUrl.username,
//   password: redisUrl.password,
// };

export const MAX_ATTEMPTS_PER_TASK = 40;
export const ATTEMPT_MS_DELAY_PER_TASK = 3000;

/**
 * Create a caller to call our other services
 */

class TaskService {
  // private scheduler: QueueScheduler = new QueueScheduler(TASK_QUEUE_NAME, {
  //   connection,
  // });

  private queue: Queue = new Queue(TASK_QUEUE_NAME, {
    // connection,
    defaultJobOptions: {
      attempts: MAX_ATTEMPTS_PER_TASK,
      backoff: {
        type: 'fixed',
        delay: ATTEMPT_MS_DELAY_PER_TASK,
      },
    },
  });

  private worker: Worker;

  public get router() {
    return router({
      create: this.create,
    });
  }

  appCaller: any = null;

  public setAppCaller = (caller: any) => {
    this.appCaller = caller;
  };

  constructor() {
    this.worker = new Worker(TASK_QUEUE_NAME, this.run);

    this.worker.on('error', console.error);
  }

  private info = (job: Job, status: string) => {
    console.log(
      `Job ID: ${job.id} | Status: ${status} | Attempt: #${job.attemptsMade}`,
    );
  };

  private run = async (job: Job<TaskData>) => {
    this.info(job, 'Running');

    const {
      data: { type },
    } = job;

    const executor: ((job: Job) => Promise<void>) | null = (() => {
      switch (type) {
        case 'Confirm Transaction':
          return this.confirmTransaction;
        default:
          return null;
      }
    })();

    if (!executor) {
      return;
    }

    await executor(job);
  };

  public createInput = z.object({
    scanId: z.string(),
    ref: z.string(),
    type: z.string(),
  });

  public create = publicProcedure
    .input(this.createInput)
    .mutation(async ({ input }) => {
      const { scanId, ref, type } = input;
      const name = `${type} for scan ${scanId}`;

      try {
        const job = await this.queue.add(
          name,
          {
            scanId,
            ref,
            type,
          },
          {
            delay: 0,
          },
        );

        return job.id;
      } catch (e) {
        return null;
      }
    });

  private confirmTransaction = async (job: Job<TaskData>) => {
    const {
      data: { scanId, ref },
    } = job;

    const signatures = await RPCConnection.getSignaturesForAddress(
      new PublicKey(ref),
      {},
      'confirmed',
    );
    const signature: string | null = signatures?.pop?.()?.signature ?? null;
    const isLastAttempt = job.attemptsMade >= MAX_ATTEMPTS_PER_TASK;

    if (signature) {
      await this.appCaller.scan.update({
        id: scanId,
        message: 'Confirmed',
        state: 'Confirmed',
        signature,
      });

      this.info(job, 'Completed');
    } else if (isLastAttempt) {
      const message = `Failed to confirm in ${
        (MAX_ATTEMPTS_PER_TASK * ATTEMPT_MS_DELAY_PER_TASK) / 60 / 1000
      } minutes`;

      await this.appCaller.scan.update({
        id: scanId,
        message,
        state: 'Failed',
        signature: null,
      });

      this.info(job, 'Failed');
    } else {
      throw new Error(
        `Could not find transaction with ref ${ref}. Trying again...`,
      );
    }
  };
}

export default new TaskService();
