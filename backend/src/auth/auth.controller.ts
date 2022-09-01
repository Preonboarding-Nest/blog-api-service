import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  Post,
  Res
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  private readonly logger = new Logger(`AuthController`);
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(201)
  @Post('login')
  @ApiOperation({
    summary: '유저 로그인 API',
    description:
      '유저의 accessToken, refreshToken을 발행하여 cookie에 저장한다.',
  })
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiBody({ type: LoginDto })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const { user, tokens } = await this.authService.login(loginDto);

    try {
      res.cookie('AccessToken', tokens.accessToken, {
        maxAge: this.configService.get('JWT_EXPIRESIN'),
        httpOnly: true,
      });

      res.cookie('RefreshToken', tokens.refreshToken, {
        maxAge: this.configService.get('JWT_REFRESH_EXPIRESIN'),
        httpOnly: true,
      });
    } catch (error) {
      throw new ForbiddenException('cookie access Failed!');
    }

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
