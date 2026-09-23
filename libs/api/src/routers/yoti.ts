import { z } from 'zod';
import { router, publicProcedure } from '../trpc/trpc.js';
import {
  createIdvSession,
  getIdvSession,
  isUserOver18,
} from '../services/yoti.service.js';

export const yotiRouter = router({
  /**
   * Creates a new IDV session for age verification
   * Returns session credentials for the frontend to use with Yoti iframe/SDK
   */
  createSession: publicProcedure
    .input(
      z.object({
        successUrl: z.string().url(),
        errorUrl: z.string().url(),
        userTrackingId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createIdvSession({
        successUrl: input.successUrl,
        errorUrl: input.errorUrl,
        userTrackingId: input.userTrackingId,
      });
    }),

  /**
   * Gets the current status of an IDV session
   */
  getSession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      return getIdvSession(input.sessionId);
    }),

  /**
   * Checks if the user passed age verification (18+)
   */
  verifyAge: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      return isUserOver18(input.sessionId);
    }),
});
