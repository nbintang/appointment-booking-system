import {
  Injectable,
  OnModuleInit,
  LoggerService,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: LoggerService) {
    super({
      adapter: null,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });
  }
  async onModuleInit() {
    this.$on('query', (event) => {
      this.logger.log(`Query: ${event.query}`);
    });
    this.$on('info', (event) => {
      this.logger.log(`Info: ${event.message}`);
    });
    this.$on('warn', (event) => {
      this.logger.log(`Warn: ${event.message}`);
    });
    this.$on('error', (event) => {
      this.logger.log(`Error: ${event.message}`);
    });
    await this.$connect();
  }
  async onModuleDestroy() {
    this.$disconnect();
  }
}
