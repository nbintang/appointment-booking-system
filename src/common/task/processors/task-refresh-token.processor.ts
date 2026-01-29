import { Processor, Process } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { TaskRefreshTokenService } from '../services/task-refresh-tokens.service';

@Processor('refresh-tokens')
@Injectable()
export class TaskRefreshTokenProcessor {
  constructor(
    private readonly logger: Logger,
    private readonly taskRefreshTokenService: TaskRefreshTokenService,
  ) {}

  @Process('cleanupExpiredRefreshTokens')
  async cleanupExpiredRefreshTokens() {
    this.logger.log('Starting cleanup expired refresh tokens');
    await this.taskRefreshTokenService.cleanupExpiredRefreshTokens();
  }
}
