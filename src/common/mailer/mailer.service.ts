import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { Injectable, LoggerService } from '@nestjs/common';

interface MailOptions {
  to: string;
  subject: string;
  text: string;
}

@Injectable()
export class MailerService {
  constructor(
    private readonly logger: LoggerService,
    private readonly mailerService: NestMailerService,
  ) {}

  async sendEmail(options: MailOptions): Promise<void> {
    this.logger.log(`Sending email to ${options.to}`);
    await this.mailerService.sendMail(options);
    this.logger.log(`Email sent to ${options.to}`);
  }
}
