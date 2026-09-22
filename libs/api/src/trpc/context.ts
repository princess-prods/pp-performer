import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

export async function createContext() {
  const databaseUrl = process.env.DATABASE_URL;

  // Lazily create DB connection only when needed
  let sql: NeonQueryFunction<false, false> | null = null;

  const getDb = () => {
    if (!sql) {
      if (!databaseUrl) {
        throw new Error('DATABASE_URL is not configured');
      }
      sql = neon(databaseUrl);
    }
    return sql;
  };

  return {
    getDb,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
