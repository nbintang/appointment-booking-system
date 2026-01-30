import { Module } from '@nestjs/common';
import { TaskAppointmentService } from './services/task-appoinment.service';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from 'src/config/config.module';
import { RedisConfigService } from 'src/config/redis/config.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskRefreshTokenService } from './services/task-refresh-tokens.service';
import { TaskAppoinmentScheduler } from './schedulers/task-appointment.scheduler';
import { TaskRefreshTokenScheduler } from './schedulers/task-refresh-token.scheduler';
import { TaskAppointmentProcessor } from './processors/task-appointment.processor';
import { TaskRefreshTokenProcessor } from './processors/task-refresh-token.processor';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [RedisConfigService],
      useFactory: async (redisConfigService: RedisConfigService) => ({
        redis: {
          host: redisConfigService.host,
          port: redisConfigService.port,
          db: redisConfigService.dbQueue,
          password: redisConfigService.password || undefined,
        },
        prefix: redisConfigService.cachePrefix,
      }),
    }),
    BullModule.registerQueue({
      name: 'appointments',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000,
        attempts: 5,
        backoff: { type: 'exponential', delay: 1000 },
      },
    }),
    BullModule.registerQueue({
      name: 'refresh-tokens',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000,
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      },
    }),
  ],
  providers: [
    TaskAppointmentService,
    TaskRefreshTokenService,
    TaskAppoinmentScheduler,
    TaskRefreshTokenScheduler,
    TaskAppointmentProcessor,
    TaskRefreshTokenProcessor,
  ],
})
export class TaskModule {}
