import { router } from './trpc';
import FaucetService from './services/faucet/faucet.service';
import ScanService from './services/scan/scan.service';

export const appRouter = router({
  faucet: new FaucetService().router,
  scan: new ScanService().router,
});

export type AppRouter = typeof appRouter;
