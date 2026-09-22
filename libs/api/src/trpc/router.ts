import { router, publicProcedure } from './trpc.js';
import { performersRouter } from '../routers/performers.js';

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  performers: performersRouter,
});

export type AppRouter = typeof appRouter;
