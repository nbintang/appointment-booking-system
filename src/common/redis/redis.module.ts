import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { RedisConfigService } from 'src/config/redis/config.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';
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
          database: parseInt(process.env.REDIS_DB ?? '0', 10),
        }),
        ttl: parseInt(process.env.REDIS_TTL ?? '5000', 10),
      }),
    }),
  ],
})
export class RedisModule {}
