import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { TaskModule } from './common/task/task.module';
import { RedisModule } from './common/redis/redis.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [LoggerModule, AuthModule, PrismaModule, TaskModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
