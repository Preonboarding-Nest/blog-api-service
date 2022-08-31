import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Res
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(`AuthController`);
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(201)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.login(loginDto);

    try {
      res.cookie('AccessToken', tokens.accessToken, {
        maxAge: this.configService.get('JWT_EXPIRESIN'),
        httpOnly: true,
        // secure:true,
      });

      res.cookie('RefreshToken', tokens.refreshToken, {
        maxAge: this.configService.get('JWT_REFRESH_EXPIRESIN'),
        httpOnly: true,
        // secure:true,
      });
    } catch (error) {}

    this.logger.verbose(`login success!`);
    return {
      user: {
        id: user.id,
        email: user.email,
        gender: user.gender,
        age: user.age,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  @Post('logout')
  async logout() {
    await this.authService.logout();
  }

  @Get('token')
  async token() {
    await this.authService.token();
  }
}
