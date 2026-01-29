import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class EmailConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get host(): string {
    return this.configService.get<string>('email.host');
  }

  get port(): string {
    return this.configService.get<string>('email.port');
  }

  get secure(): boolean {
    return this.configService.get<boolean>('email.secure');
  }

  get user(): string {
    return this.configService.get<string>('email.user');
  }

  get password(): string {
    return this.configService.get<string>('email.password');
  }

  get from(): string {
    return this.configService.get<string>('email.from');
  }
}
