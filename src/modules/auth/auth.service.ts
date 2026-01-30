import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { MailerService } from 'src/common/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as crypto from 'crypto';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailerService,
    private readonly redisService: RedisService,
  ) {}
  private async hash(v: string): Promise<string> {
    return await argon2.hash(v);
  }
  private async compareHashes(v: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, v);
  }

  private generateRefreshTokenPlain(): string {
    return crypto.randomBytes(64).toString('base64url');
  }

  private generateAccessToken(user: JwtPayload) {
    return this.jwtService.signAsync({
      sub: user.sub,
      email: user.email,
    });
  }

  async register(dto: RegisterDto) {
    const existedUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existedUser) throw new ConflictException('Email already exists');
    const hashedPassword = await this.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });
    const accessToken = await this.generateAccessToken({
      sub: user.id,
      email: user.email,
    });
    return { message: 'User registered successfully' };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('Email not found');
    const isPasswordValid = await this.compareHashes(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) throw new ConflictException('Password is incorrect');
    const accessToken = await this.generateAccessToken({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = this.generateRefreshTokenPlain();
    const refreshHash = await this.hash(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Set expiration time for refresh token 7 days
    const tokenRow = await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshHash,
        isRevoked: false,
        expiresAt,
      },
    });
    return { user, accessToken, refreshToken, refreshTokenId: tokenRow.id };
  }

  async refreshToken({ refreshTokenPlain, refreshTokenId }) {
    const tokenRow = await this.prisma.refreshToken.findUnique({
      where: { id: refreshTokenId },
    });

    if (!tokenRow || tokenRow.isRevoked || tokenRow.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const ok = await this.compareHashes(refreshTokenPlain, tokenRow.tokenHash);
    if (!ok) {
      await this.prisma.refreshToken.updateMany({
        where: { userId: tokenRow.userId, isRevoked: false },
        data: { isRevoked: true },
      });
      throw new UnauthorizedException('Token compromised');
    }

    await this.prisma.refreshToken.update({
      where: { id: tokenRow.id },
      data: { isRevoked: true },
    });

    const newRefreshToken = this.generateRefreshTokenPlain();
    const newHash = await this.hash(newRefreshToken);

    const newRow = await this.prisma.refreshToken.create({
      data: {
        userId: tokenRow.userId,
        tokenHash: newHash,
        isRevoked: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: tokenRow.userId },
    });

    const accessToken = await this.generateAccessToken({
      email: user.email,
      sub: user.id,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      refreshTokenId: newRow.id,
    };
  }
  async getProfile(userId: string) {
    const key = `user:profile:${userId}`;

    const cachedUser = await this.redisService.get(key);
    if (cachedUser) return cachedUser;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.redisService.set(key, user);

    return user;
  }

  async logout(refreshTokenId: string) {
    if (!refreshTokenId)
      throw new UnauthorizedException('Refresh token not found');
    console.log(refreshTokenId);
    const updated = await this.prisma.refreshToken.updateMany({
      where: { id: refreshTokenId, isRevoked: false },
      data: { isRevoked: true },
    });
    return updated;
  }
}
