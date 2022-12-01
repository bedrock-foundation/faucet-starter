import { router } from './trpc';
import faucetService from './services/faucet/faucet.service';
import scanService from './services/scan/scan.service';
import taskService from './services/task/task.service';

export const appRouter = router({
  faucet: faucetService.router,
  scan: scanService.router,
  task: taskService.router,
});

export type AppRouter = typeof appRouter;

export const appCaller = appRouter.createCaller({});

export type AppCaller = typeof appCaller;

faucetService.setCaller(appCaller);
scanService.setCaller(appCaller);
taskService.setCaller(appCaller);
