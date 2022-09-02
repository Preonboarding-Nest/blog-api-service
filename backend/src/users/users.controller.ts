import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UnauthorizedException,
  Redirect,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
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

@Controller('users')
@ApiTags('Users API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성합니다.' })
  @ApiCreatedResponse({ description: '유저를 생성합니다.', type: User })
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '유저 조회 API', description: '유저를 조회합니다.' })
  @ApiCreatedResponse({ description: '유저를 조회합니다.', type: User })
  findOneUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findUserById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '유저 삭제 API', description: '유저를 삭제합니다.' })
  @ApiCreatedResponse({ description: '유저를 삭제합니다.', type: null })
  @ApiCookieAuth('refreshToken')
  @ApiCookieAuth('accessToken')
  @UseGuards(AuthGuard('jwt'))
  removeUserById(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUserId() currentUserId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    if (id !== currentUserId) {
      throw new UnauthorizedException();
    }

    res.clearCookie('AccessToken');
    res.clearCookie('RefreshToken');

    return this.usersService.removeUserById(id);
  }
}
