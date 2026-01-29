import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { MailerModule } from 'src/common/mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthConfigService } from 'src/config/auth/config.service'; 
import { AccessTokenStrategy } from './strategies/access-token.strategy';

@Module({
  imports: [
    PrismaModule,
    MailerModule,

    JwtModule.registerAsync({
      inject: [AuthConfigService],
      useFactory: async (authConfigService: AuthConfigService) => ({
        secret: authConfigService.jwtAccessSecret,
        signOptions: { expiresIn: '15s' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy],
})
export class AuthModule {}
