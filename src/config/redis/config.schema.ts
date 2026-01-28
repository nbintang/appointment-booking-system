import { z } from 'zod';

export const redisConfigSchema = z.object({
  redisHost: z.string().default('localhost'),
  redisPort: z.number().default(6379),
  redisPassword: z.string().default(''),
});
