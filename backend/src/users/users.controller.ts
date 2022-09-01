import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

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
  removeUserById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.removeUserById(id);
  }
}