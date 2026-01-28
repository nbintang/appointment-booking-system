import { z } from 'zod';

export const databaseConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.number().default(5432),
  username: z.string().default('postgres'),
  password: z.string().default('postgres'),
  database: z.string().default('postgres'),
  sslMode: z.string().default('disable'),
});
