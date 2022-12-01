import { router } from './trpc';
import scanService from './services/scan/scan.service';
import faucetService from './services/faucet/faucet.service';
import taskService from './services/task/task.service';

export const appRouter = router({
  faucet: faucetService.router,
  scan: scanService.router,
  task: taskService.router,
});

const caller = appRouter.createCaller({});

faucetService.setAppCaller(caller);
scanService.setAppCaller(caller);
taskService.setAppCaller(caller);

export type AppRouter = typeof appRouter;
