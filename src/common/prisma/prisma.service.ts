import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { DatabaseConfigService } from 'src/config/database/config.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly logger: Logger,
    private readonly dbConfigService: DatabaseConfigService,
  ) {
    const connectionString = `postgresql://${dbConfigService.username}:${dbConfigService.password}@${dbConfigService.host}:${dbConfigService.port}/${dbConfigService.database}?sslmode=${dbConfigService.sslMode}`;
    const adapter = new PrismaPg({ connectionString });
    super({
      adapter,
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
