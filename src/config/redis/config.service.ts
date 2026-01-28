import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService {
  constructor(private readonly configService: NestConfigService) {}
  get host(): string {
    return this.configService.get<string>('redis.host', { infer: true });
  }

  get port(): number {
    return this.configService.get<number>('redis.port', { infer: true });
  }

  get password(): string {
    return this.configService.get<string>('redis.password', { infer: true });
  }
}
