import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get jwtAccessSecret(): string {
    return this.configService.get<string>('auth.jwtAccessSecret', {
      infer: true,
    });
  }
}
