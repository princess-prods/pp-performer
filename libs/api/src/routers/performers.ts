import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc/trpc.js';
import { performerUpsertSchema } from '../schemas/performer.js';
import { z } from 'zod';

// Helper to map DB row to response shape
function mapPerformerRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    externalId: row.external_id as string | null,
    firstName: row.first_name as string,
    middleName: row.middle_name as string | null,
    lastName: row.last_name as string,
    email: row.email as string,
    phone: row.phone as string | null,
    age: row.age as number,
    isVerified18: row.is_verified_18 as boolean,
    city: row.city as string,
    stateProvince: row.state_province as string,
    country: row.country as string,
    genderId: row.gender_id as number,
    socialLinks: row.social_links as string[],
    createdAt: row.created_at as Date,
    updatedAt: row.updated_at as Date,
  };
}

function mapPerformerRowWithActs(row: Record<string, unknown>) {
  return {
    ...mapPerformerRow(row),
    actIds: (row.act_ids as string[] | null) ?? [],
  };
}

export const performersRouter = router({
  upsert: publicProcedure
    .input(performerUpsertSchema)
    .mutation(async ({ ctx, input }) => {
      const db = ctx.getDb();

      // Upsert performer using email as the unique constraint
      const result = await db`
        INSERT INTO performers (
          external_id,
          first_name,
          middle_name,
          last_name,
          email,
          phone,
          age,
          is_verified_18,
          city,
          state_province,
          country,
          gender_id,
          social_links
        ) VALUES (
          ${input.externalId ?? null},
          ${input.firstName},
          ${input.middleName ?? null},
          ${input.lastName},
          ${input.email},
          ${input.phone ?? null},
          ${input.age},
          ${input.isVerified18},
          ${input.city},
          ${input.stateProvince},
          ${input.country},
          ${input.genderId},
          ${input.socialLinks}
        )
        ON CONFLICT (email) DO UPDATE SET
          external_id = COALESCE(EXCLUDED.external_id, performers.external_id),
          first_name = EXCLUDED.first_name,
          middle_name = EXCLUDED.middle_name,
          last_name = EXCLUDED.last_name,
          phone = EXCLUDED.phone,
          age = EXCLUDED.age,
          is_verified_18 = EXCLUDED.is_verified_18,
          city = EXCLUDED.city,
          state_province = EXCLUDED.state_province,
          country = EXCLUDED.country,
          gender_id = EXCLUDED.gender_id,
          social_links = EXCLUDED.social_links,
          updated_at = NOW()
        RETURNING *
      `;

      const performer = result[0];
      if (!performer) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upsert performer' });
      }

      // Handle act associations if provided
      if (input.actIds.length > 0) {
        // Clear existing associations
        await db`
          DELETE FROM performer_acts WHERE performer_id = ${performer.id}
        `;

        // Insert new associations
        for (const actId of input.actIds) {
          await db`
            INSERT INTO performer_acts (performer_id, act_id)
            VALUES (${performer.id}, ${actId})
            ON CONFLICT DO NOTHING
          `;
        }
      }

      return mapPerformerRow(performer);
    }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.getDb();

      const result = await db`
        SELECT p.*, array_agg(pa.act_id) FILTER (WHERE pa.act_id IS NOT NULL) as act_ids
        FROM performers p
        LEFT JOIN performer_acts pa ON p.id = pa.performer_id
        WHERE p.email = ${input.email}
        GROUP BY p.id
      `;

      const performer = result[0];
      if (!performer) {
        return null;
      }

      return mapPerformerRowWithActs(performer);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.getDb();

      const result = await db`
        SELECT p.*, array_agg(pa.act_id) FILTER (WHERE pa.act_id IS NOT NULL) as act_ids
        FROM performers p
        LEFT JOIN performer_acts pa ON p.id = pa.performer_id
        WHERE p.id = ${input.id}
        GROUP BY p.id
      `;

      const performer = result[0];
      if (!performer) {
        return null;
      }

      return mapPerformerRowWithActs(performer);
    }),
});
