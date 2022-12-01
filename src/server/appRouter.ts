import { router } from './trpc';
import scanService from './services/scan/scan.service';
import faucetService from './services/faucet/faucet.service';

export const appRouter = router({
  faucet: faucetService.router,
  scan: scanService.router,
});

export const appCaller = appRouter.createCaller({});

faucetService.setAppCaller(appCaller);
scanService.setAppCaller(appCaller);

export type AppRouter = typeof appRouter;
