import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { TaskModule } from './common/task/task.module';

@Module({
  imports: [AuthModule, PrismaModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
