import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class EmailConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get host(): string {
    return this.configService.get<string>('SMTP_HOST');
  }

  get port(): string {
    return this.configService.get<string>('SMTP_PORT');
  }

  get secure(): boolean {
    return this.configService.get<boolean>('SMTP_SECURE');
  }

  get user(): string {
    return this.configService.get<string>('SMTP_USER');
  }

  get password(): string {
    return this.configService.get<string>('SMTP_PASSWORD');
  }

  get from(): string {
    return this.configService.get<string>('SMTP_SENDER');
  }
}
