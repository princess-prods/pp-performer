import { neon } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema.js';

export type Database = NeonHttpDatabase<typeof schema>;

let db: Database | null = null;

export async function createContext() {
  const databaseUrl = process.env.DATABASE_URL;

  const getDb = (): Database => {
    if (!db) {
      if (!databaseUrl) {
        throw new Error('DATABASE_URL is not configured');
      }
      const sql = neon(databaseUrl);
      db = drizzle(sql, { schema });
    }
    return db;
  };

  return {
    getDb,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
