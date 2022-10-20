import { router } from './trpc';
import FaucetService from './services/faucet/faucet.service';

export const appRouter = router({
  faucet: FaucetService.router,
});

export type AppRouter = typeof appRouter;
