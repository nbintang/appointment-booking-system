import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './common/task/task.module';
import { LoggerModule } from './common/logger/logger.module';
import { MailerModule } from './common/mailer/mailer.module';
import { ConfigModule } from './config/config.module';
import { AppointmentModule } from './modules/appointment/appointment.module';

@Module({
  imports: [LoggerModule, AuthModule, TaskModule, MailerModule, ConfigModule, AppointmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
