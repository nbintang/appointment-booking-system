import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto, LoginDto } from './dto/login.dto';
import { RegisterDto, UpdateAuthDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { MailerService } from 'src/common/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailerService,
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

  private verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token);
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
    return { accessToken };
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
    const expiresTime =  60; // 3 hours in seconds
    const expiresAt = new Date(Date.now() + expiresTime * 1000);
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshHash,
        isRevoked: false,
        expiresAt,
      },
    });
    return { user, accessToken, refreshToken };
  }
  
   
}
