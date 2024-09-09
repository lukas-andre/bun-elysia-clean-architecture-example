import { z } from 'zod';

const envSchema = z.object({
  // Application
  NODE_ENV: z
    .enum(['test', 'development', 'production'])
    .default('development'),
  PORT: z.string().default('4000'),

  // Database
  PGHOST: z.string().default('localhost'),
  PGPORT: z.string().default('6543'),
  PGDATABASE: z.string().default('notes_api'),
  PGUSER: z.string().default('notes_user'),
  PGPASSWORD: z.string(),
  PGIDLE_TIMEOUT: z.string().default('0'),
  PGCONNECT_TIMEOUT: z.string().default('30'),

  // Docker Compose
  POSTGRES_DB: z.string().default('notes_api'),
  POSTGRES_USER: z.string().default('notes_user'),
  POSTGRES_PASSWORD: z.string(),

  // Additional Elysia-specific variables
  ELYSIA_VERSION: z.string().default('0.0.0'),
  RUNTIME: z.enum(['bun', 'edge']).default('bun'),
});

export const env = envSchema.parse(process.env);

export const DATABASE_URL = `postgres://${env.PGUSER}:${env.PGPASSWORD}@${env.PGHOST}:${env.PGPORT}/${env.PGDATABASE}`;
