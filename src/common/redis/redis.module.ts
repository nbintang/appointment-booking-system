import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { RedisConfigService } from 'src/config/redis/config.service';
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (redisConfigService: RedisConfigService) => ({
        stores: await redisStore({
          socket: {
            host: redisConfigService.host,
            port: redisConfigService.port,
          },
          password: redisConfigService.password || undefined,
          database: parseInt(process.env.REDIS_DB ?? '0', 10),
        }),
        ttl: parseInt(process.env.REDIS_TTL ?? '5000', 10),
      }),
    }),
  ],
})
export class RedisModule {}
