import { router } from './trpc';
import faucetService from './services/faucet/faucet.service';
import scanService from './services/scan/scan.service';

export const appRouter = router({
  faucet: faucetService.router,
  scan: scanService.router,
});

faucetService.setAppRouter(appRouter);
scanService.setAppRouter(appRouter);

export type AppRouter = typeof appRouter;
