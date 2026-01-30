import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { RedisConfigService } from 'src/config/redis/config.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';
import { RedisService } from './redis.service';
@Module({
  imports: [
    LoggerModule,
    PrismaModule,
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [RedisConfigService],
      useFactory: async (redisConfigService: RedisConfigService) => ({
        store: await redisStore({
          socket: {
            host: redisConfigService.host,
            port: redisConfigService.port,
          },
          password: redisConfigService.password || undefined,
          db: redisConfigService.dbCache,
        }),
        ttl: redisConfigService.cacheTtl,
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
