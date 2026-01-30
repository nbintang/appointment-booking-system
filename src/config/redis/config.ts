import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  redisHost: process.env.REDIS_HOST,
  redisPort: parseInt(process.env.REDIS_PORT),
  redisPassword: process.env.REDIS_PASSWORD,
  redisDbQueue: parseInt(process.env.REDIS_DB_QUEUE),
  redisDbCache: parseInt(process.env.REDIS_DB_CACHE),
  redisQueuePrefix: process.env.REDIS_QUEUE_PREFIX,
  redisCachePrefix: process.env.REDIS_CACHE_PREFIX,
  redisCacheTtl: parseInt(process.env.REDIS_CACHE_TTL),
}));
