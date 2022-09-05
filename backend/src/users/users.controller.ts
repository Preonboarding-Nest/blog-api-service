import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UnauthorizedException,
  Res,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUserId } from '../commons/decorators/get.current-userId.decorator';
import { Response } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { API_METHOD, API_RESOURCE, EVENTS } from '../commons/constants';
import { StatisticsSaveEvent } from '../statistics/events/statistics-save.event';
import { Serialize } from '../interceptors/serialize.interceptor';


@Controller('users')
@ApiTags('Users API')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @Serialize(CreateUserResponseDto)
  @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성합니다.' })
  @ApiCreatedResponse({ description: '유저를 생성합니다.', type: User })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.createUser(createUserDto);

    this.eventEmitter.emit(
      EVENTS.STATISTICS_SAVE,
      new StatisticsSaveEvent(API_RESOURCE.USER._, API_METHOD.POST, user.id),
    );

    return user;
  }

  @Get(':id')
  @Serialize(CreateUserResponseDto)
  @ApiOperation({ summary: '유저 조회 API', description: '유저를 조회합니다.' })
  @ApiCreatedResponse({ description: '유저를 조회합니다.', type: User })
  async findOneUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.findUserById(id);

    this.eventEmitter.emit(
      EVENTS.STATISTICS_SAVE,
      new StatisticsSaveEvent(API_RESOURCE.USER._, API_METHOD.GET, user.id),
    );

    return user;
  }

  @Delete(':id')
  @ApiOperation({ summary: '유저 삭제 API', description: '유저를 삭제합니다.' })
  @ApiCreatedResponse({ description: '유저를 삭제합니다.', type: null })
  @ApiCookieAuth('refreshToken')
  @ApiCookieAuth('accessToken')
  @UseGuards(AuthGuard('jwt'))
  async removeUserById(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUserId() currentUserId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    if (id !== currentUserId) {
      throw new UnauthorizedException();
    }

    try {
      // 유저 삭제 시 Cookie에서 AccessToken 과 RefreshToken을 clear 합니다
      res.clearCookie('AccessToken');
      res.clearCookie('RefreshToken');
    } catch (error) {
      throw new ForbiddenException('Cookie access 실패');
    }

    await this.usersService.removeUserById(id);

    this.eventEmitter.emit(
      EVENTS.STATISTICS_SAVE,
      new StatisticsSaveEvent(
        API_RESOURCE.USER._,
        API_METHOD.DELETE,
        currentUserId,
      ),
    );

    return;
  }
}
