import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  redisHost: process.env.REDIS_HOST,
  redisPort: parseInt(process.env.REDIS_PORT),
  redisPassword: process.env.REDIS_PASSWORD,
}));
