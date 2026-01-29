import { z } from 'zod';

export const databaseConfigSchema = z.object({
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_USERNAME: z.string().default('postgres'),
  DATABASE_PASSWORD: z.string().default('postgres'),
  DATABASE_DATABASE: z.string().default('postgres'),
  DATABASE_SSL_MODE: z.string().default('disable'),
});
