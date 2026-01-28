import { z } from 'zod';

export const emailConfigSchema = z.object({
  host: z.string(),
  port: z.string(),
  secure: z.boolean().default(false),
  user: z.string(),
  password: z.string(),
  from: z.string(),
});
