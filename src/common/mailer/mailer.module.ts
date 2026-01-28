import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { EmailConfigService } from 'src/config/email/config.service';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      useFactory: async (emailConfigService: EmailConfigService) => ({
        transport: {
          host: emailConfigService.host,
          port: emailConfigService.port,
          secure: emailConfigService.secure,
          auth: {
            user: emailConfigService.user,
            pass: emailConfigService.password,
          },
        },
      }),
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
