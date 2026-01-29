import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskRefreshTokenService } from '../services/task-refresh-tokens.service';

@Injectable()
export class TaskRefreshTokenScheduler {
  constructor(
    private readonly logger: Logger,
    private readonly taskRefreshTokenService: TaskRefreshTokenService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS) 
  async handleTokenCleanup(): Promise<void> {
    this.logger.log('Starting token cleanup');
    await this.taskRefreshTokenService.addCleanupRefreshTokenJob();
  }
}
