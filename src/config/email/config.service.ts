import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class EmailConfigService {
  constructor(private readonly configService: NestConfigService) {}
}