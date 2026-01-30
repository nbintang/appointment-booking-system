import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from './decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() body: LoginDto,
  ) {
    const { accessToken, refreshToken, refreshTokenId } =
      await this.authService.login(body);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    res.cookie('refresh_token_id', refreshTokenId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    return { accessToken };
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
  @Post('refresh-token')
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    const refreshTokenId = req.cookies['refresh_token_id'];

    if (!refreshToken || !refreshTokenId) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      refreshTokenId: newId,
    } = await this.authService.refreshToken({
      refreshTokenPlain: refreshToken,
      refreshTokenId,
    });

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    res.cookie('refresh_token_id', newId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    return { accessToken };
  }
  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getProfile(@User() user: JwtPayload) {
    const userId = user.sub;
    return this.authService.getProfile(userId);
  }

  @Delete('logout')
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const refreshTokenId = req.cookies['refresh_token_id'];
    await this.authService.logout(refreshTokenId);
    res.clearCookie('refresh_token');
    res.clearCookie('refresh_token_id');
    return { message: 'Logout berhasil' };
  }
}
