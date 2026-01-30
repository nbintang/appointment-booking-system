import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class TaskRefreshTokenService {
  constructor(
    private readonly logger: Logger,
    private readonly prisma: PrismaService,
    @InjectQueue('refresh-tokens') private readonly refreshTokensQueue: Queue,
  ) {}

  async addCleanupRefreshTokenJob(): Promise<void> {
    this.logger.log('Adding cleanup expired refresh tokens job');
    await this.refreshTokensQueue.add('cleanupExpiredRefreshTokens', {});
  }

  async cleanupExpiredRefreshTokens(): Promise<void> {
    this.logger.log('Starting cleanup of expired refresh tokens');
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          {
            isRevoked: true,
            createdAt: { lt: new Date(Date.now() - 60_000) },
          },
        ],
      },
    });
    this.logger.log(`Deleted ${result.count} expired refresh tokens`);
  }
}
