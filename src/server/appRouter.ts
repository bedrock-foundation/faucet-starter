import { router } from './trpc';
import scanService from './services/scan/scan.service';
import faucetService from './services/faucet/faucet.service';
import taskService from './services/task/task.service';

export const appRouter = router({
  faucet: faucetService.router,
  scan: scanService.router,
  task: taskService.router,
});

export const appCaller = appRouter.createCaller({});

faucetService.setAppCaller(appCaller);
scanService.setAppCaller(appCaller);
taskService.setAppCaller(appCaller);

export type AppRouter = typeof appRouter;
