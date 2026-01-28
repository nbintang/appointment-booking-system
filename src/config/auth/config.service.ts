import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private readonly configService: NestConfigService) {}

  getJwtAccessSecret(): string {
    return this.configService.get<string>('auth.jwtAccessSecret', {
      infer: true,
    });
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('auth.jwtRefreshSecret', {
      infer: true,
    });
  }
}
