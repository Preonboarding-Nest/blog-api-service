import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindPostResponseDto } from './dto/find-post.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUserId } from '../commons/decorators';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { POST_TYPE_ENUM } from '../commons/enums/commons.enums';
import { API_METHOD, API_RESOURCE, EVENTS } from '../commons/constants';
import { StatisticsSaveEvent } from '../statistics/events/statistics-save.event';

@Controller('posts')
@ApiTags('Posts API')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @ApiOperation({ summary: '게시글 등록 API' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '게시글 등록 성공',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('refreshToken')
  @ApiCookieAuth('accessToken')
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @GetCurrentUserId() currentUserId: number,
  ): Promise<number> {
    let result;
    try {
      result = await this.postsService.create(currentUserId, createPostDto);
    } catch (e) {
      return e;
    }
    this.emitPostStatisticsEvent(API_METHOD.POST, currentUserId, result.type);
    return result.id;
  }

  @ApiOperation({ summary: '게시글 목록 조회 API' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글 목록 조회 성공',
    type: FindPostResponseDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('refreshToken')
  @ApiCookieAuth('accessToken')
  @Get()
  async findAll(
    @GetCurrentUserId() currentUserId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<FindPostResponseDto[]> {
    let result;
    try {
      result = await this.postsService.findAll(currentUserId, categoryId);
    } catch (e) {
      return e;
    }
    this.emitPostStatisticsEvent(API_METHOD.GETS, currentUserId, result.type);
    return result.posts;
  }

  @ApiOperation({ summary: '게시글 상세 조회 API' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글 상세 조회 성공',
    type: FindPostResponseDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('refreshToken')
  @ApiCookieAuth('accessToken')
  @Get(':id')
  async findOne(
    @GetCurrentUserId() currentUserId: number,
    @Param('id', ParseIntPipe) postId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<FindPostResponseDto> {
    let result;
    try {
      result = await this.postsService.findOne(
        currentUserId,
        postId,
        categoryId,
      );
    } catch (e) {
      return e;
    }
    this.emitPostStatisticsEvent(API_METHOD.GET, currentUserId, result.type);
    return result.post;
  }

  @ApiOperation({ summary: '게시글 수정 API' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글 수정 성공',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('refreshToken')
  @ApiCookieAuth('accessToken')
  @Patch(':id')
  async update(
    @GetCurrentUserId() currentUserId: number,
    @Param('id', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    try {
      await this.postsService.update(currentUserId, postId, updatePostDto);
    } catch (e) {
      return e;
    }

    this.emitPostStatisticsEvent(API_METHOD.PATCH, currentUserId, null);
  }

  @ApiOperation({ summary: '게시글 삭제 API' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글 삭제 성공',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('refreshToken')
  @ApiCookieAuth('accessToken')
  @Delete(':id')
  async remove(
    @GetCurrentUserId() currentUserId: number,
    @Param('id', ParseIntPipe) postId: number,
  ): Promise<void> {
    try {
      await this.postsService.remove(currentUserId, postId);
    } catch (e) {
      return e;
    }
    this.emitPostStatisticsEvent(API_METHOD.DELETE, currentUserId, null);
  }

  /**
   * 게시글 통계용 emit
   * @param method API_METHOD 상수 값으로 API 메서드를 지정합니다.
   * @param currentUserId 현재 로그인한 사용자의 id값을 지정합니다.
   * @param postType POST_TYPE_ENUM으로 게시글 타입을 지정합니다.
   */
  emitPostStatisticsEvent(
    method: string,
    currentUserId: number,
    postType: number | null,
  ) {
    let resource: string;
    if (postType === POST_TYPE_ENUM.FREE) {
      resource = API_RESOURCE.POST._FREE;
    } else if (postType === POST_TYPE_ENUM.NOTICE) {
      resource = API_RESOURCE.POST._NOTICE;
    } else if (postType === POST_TYPE_ENUM.PROD) {
      resource = API_RESOURCE.POST._OPERATE;
    } else {
      resource = API_RESOURCE.POST._;
    }

    this.eventEmitter.emit(
      EVENTS.STATISTICS_SAVE,
      new StatisticsSaveEvent(resource, method, currentUserId),
    );
  }
}
