import { Module } from '@nestjs/common';
import { TaskAppointmentService } from './services/task-appoinment.service';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from 'src/config/config.module';
import { RedisConfigService } from 'src/config/redis/config.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [RedisConfigService],
      useFactory: async (redisConfigService: RedisConfigService) => ({
        redis: {
          host: redisConfigService.host,
          port: redisConfigService.port,
        },
        password: redisConfigService.password || undefined,
        database: parseInt(process.env.REDIS_DB ?? '0', 10),
      }),
    }),
    BullModule.registerQueue({ name: 'appointments' }),
    BullModule.registerQueue({ name: 'refresh-tokens' }),
    ScheduleModule.forRoot(),
  ],
  providers: [TaskAppointmentService],
})
export class TaskModule {}
