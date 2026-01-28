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
    await this.refreshTokensQueue.add('cleanupExpiredRefreshTokens', {});
  }

  async cleanupExpiredRefreshTokens(): Promise<void> {
    this.logger.log('Starting cleanup of expired refresh tokens');
    const expiredTokens = await this.prisma.refreshToken.findMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        isRevoked: false,
      },
    });

    if (expiredTokens.length > 0) {
      this.logger.log(`Found ${expiredTokens.length} expired refresh tokens`);
      await this.prisma.refreshToken.updateMany({
        where: {
          id: {
            in: expiredTokens.map((token) => token.id),
          },
        },
        data: {
          isRevoked: true,
        },
      });
    } else {
      this.logger.log('No expired refresh tokens found');
    }
  }
}
