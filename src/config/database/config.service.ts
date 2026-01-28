import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get host(): string {
    return this.configService.get<string>('database.host', { infer: true });
  }

  get port(): number {
    return this.configService.get<number>('database.port', { infer: true });
  }

  get username(): string {
    return this.configService.get<string>('database.username', { infer: true });
  }

  get password(): string {
    return this.configService.get<string>('database.password', { infer: true });
  }

  get database(): string {
    return this.configService.get<string>('database.database', { infer: true });
  }

  get sslMode(): string {
    return this.configService.get<string>('database.sslMode', { infer: true });
  }
}
