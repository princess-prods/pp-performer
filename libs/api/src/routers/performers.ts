import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { router, publicProcedure } from '../trpc/trpc.js';
import { performerUpsertSchema } from '../schemas/performer.js';
import { performers, performerActs } from '../db/schema.js';
import { z } from 'zod';

export const performersRouter = router({
  upsert: publicProcedure
    .input(performerUpsertSchema)
    .mutation(async ({ ctx, input }) => {
      const db = ctx.getDb();

      // Upsert performer using email as the unique constraint
      const result = await db
        .insert(performers)
        .values({
          externalId: input.externalId ?? null,
          firstName: input.firstName,
          middleName: input.middleName ?? null,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone ?? null,
          age: input.age,
          isVerified18: input.isVerified18,
          city: input.city,
          stateProvince: input.stateProvince,
          country: input.country,
          genderId: input.genderId,
          socialLinks: input.socialLinks,
        })
        .onConflictDoUpdate({
          target: performers.email,
          set: {
            externalId: input.externalId ?? undefined,
            firstName: input.firstName,
            middleName: input.middleName ?? null,
            lastName: input.lastName,
            phone: input.phone ?? null,
            age: input.age,
            isVerified18: input.isVerified18,
            city: input.city,
            stateProvince: input.stateProvince,
            country: input.country,
            genderId: input.genderId,
            socialLinks: input.socialLinks,
            updatedAt: new Date(),
          },
        })
        .returning();

      const performer = result[0];
      if (!performer) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upsert performer' });
      }

      // Handle act associations if provided
      if (input.actIds.length > 0) {
        // Clear existing associations
        await db.delete(performerActs).where(eq(performerActs.performerId, performer.id));

        // Insert new associations
        await db.insert(performerActs).values(
          input.actIds.map((actId) => ({
            performerId: performer.id,
            actId,
          }))
        );
      }

      return performer;
    }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.getDb();

      const result = await db.query.performers.findFirst({
        where: eq(performers.email, input.email),
        with: {
          performerActs: {
            columns: {
              actId: true,
            },
          },
        },
      });

      if (!result) {
        return null;
      }

      return {
        ...result,
        actIds: result.performerActs.map((pa) => pa.actId),
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.getDb();

      const result = await db.query.performers.findFirst({
        where: eq(performers.id, input.id),
        with: {
          performerActs: {
            columns: {
              actId: true,
            },
          },
        },
      });

      if (!result) {
        return null;
      }

      return {
        ...result,
        actIds: result.performerActs.map((pa) => pa.actId),
      };
    }),
});
