import { z } from 'zod';

export const redisConfigSchema = z.object({
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().default(''),
  REDIS_DB_QUEUE: z.coerce.number().default(0),
  REDIS_DB_CACHE: z.coerce.number().default(1),
  REDIS_QUEUE_PREFIX: z.string().default('bull'),
  REDIS_CACHE_PREFIX: z.string().default('cache'),
  REDIS_CACHE_TTL: z.coerce.number().default(300),
});
