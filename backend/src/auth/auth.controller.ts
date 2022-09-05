import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Response } from 'express';
import { API_METHOD, API_RESOURCE, EVENTS } from '../commons/constants';
import { GetCurrentUserId } from '../commons/decorators';
import { StatisticsSaveEvent } from '../statistics/events/statistics-save.event';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  private readonly logger = new Logger(`AuthController`);
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
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
        secure: true,
      });
    } catch (error) {
      throw new ForbiddenException('cookie access Failed!');
    }

    this.eventEmitter.emit(
      EVENTS.STATISTICS_SAVE,
      new StatisticsSaveEvent(API_RESOURCE.AUTH._LOGIN, API_METHOD.POST),
    );

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

  @HttpCode(201)
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '유저 로그아웃 API',
    description: '유저의 accessToken, refreshToken를 삭제한다.',
  })
  @ApiResponse({
    status: 201,
    description: '로그아웃 성공',
  })
  @ApiCookieAuth('refreshToken')
  @ApiCookieAuth('accessToken')
  async logout(
    @GetCurrentUserId() id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(id);

    try {
      res.clearCookie('AccessToken');
      res.clearCookie('RefreshToken');

      this.logger.verbose(`logout success!`);
    } catch (error) {
      throw new ForbiddenException('cookie access Failed!');
    }
  }

  @HttpCode(200)
  @Get('token')
  @UseGuards(AuthGuard('refresh'))
  @ApiOperation({
    summary: '유저 액세스 토큰 발행 API',
    description: '유저의 refreshToken으로 accessToken을 발행한다.',
  })
  @ApiResponse({
    status: 200,
    description: '액세스 토큰 발행 성공',
  })
  @ApiCookieAuth('refreshToken')
  @ApiCookieAuth('accessToken')
  async token(
    @GetCurrentUserId() id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken: string = await this.authService.token(id);
    try {
      res.cookie('AccessToken', accessToken, {
        maxAge: this.configService.get('JWT_EXPIRESIN'),
        httpOnly: true,
      });
    } catch (error) {
      throw new ForbiddenException('cookie access Failed!');
    }
  }
}
