import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { API_METHOD, API_RESOURCE, EVENTS } from '../commons/constants';
import { GetCurrentUserId } from '../commons/decorators';
import { StatisticsSaveEvent } from '../statistics/events/statistics-save.event';
import { CreatePostCategoryDto } from './dto/create-postCategory.dto';
import { UpdatePostCategoryDto } from './dto/update-postCategory.dto';
import { PostCategory } from './entities/post-category.entity';
import { PostsCategoryService } from './posts-category.service';

@ApiTags('Posts API')
@Controller('posts/categories')
export class PostsCategoryController {
  constructor(
    private postsCategoryService: PostsCategoryService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @ApiOperation({ summary: '게시글 종류 등록 API' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '게시글 종류 등록 성공',
  })
  @ApiBody({ type: CreatePostCategoryDto })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createPostCategory(
    @Body() createPostCategoryDto: CreatePostCategoryDto,
    @GetCurrentUserId() currentUserId: number,
  ): void {
    this.postsCategoryService.createPostCategory(createPostCategoryDto);

    this.eventEmitter.emit(
      EVENTS.STATISTICS_SAVE,
      new StatisticsSaveEvent(
        API_RESOURCE.POST_CATEGORY._,
        API_METHOD.POST,
        currentUserId,
      ),
    );
  }

  @ApiOperation({ summary: '게시글 종류 조회 API' })
  @ApiOkResponse({
    description: '게시글 종류 조회 성공',
    type: PostCategory,
    isArray: true,
  })
  @Get()
  async findAllPostCategories(): Promise<PostCategory[]> {
    const categories = await this.postsCategoryService.findAllPostCategories();

    this.eventEmitter.emit(
      EVENTS.STATISTICS_SAVE,
      new StatisticsSaveEvent(API_RESOURCE.POST_CATEGORY._, API_METHOD.GETS),
    );

    return categories;
  }

  @ApiOperation({ summary: '게시글 종류 수정 API' })
  @ApiOkResponse({
    description: '게시글 종류 수정 성공',
    type: PostCategory,
  })
  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  async updatePostCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostCategoryDto: UpdatePostCategoryDto,
    @GetCurrentUserId() currentUserId: number,
  ): Promise<PostCategory> {
    const category = await this.postsCategoryService.updatePostCategory(
      id,
      updatePostCategoryDto,
    );

    this.eventEmitter.emit(
      EVENTS.STATISTICS_SAVE,
      new StatisticsSaveEvent(
        API_RESOURCE.POST_CATEGORY._,
        API_METHOD.GET,
        currentUserId,
      ),
    );

    return category;
  }

  @ApiOperation({ summary: '게시글 종류 삭제 API' })
  @ApiOkResponse({
    description: '게시글 종류 삭제 성공',
  })
  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async deletePostCategory(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUserId() currentUserId: number,
  ): Promise<void> {
    await this.postsCategoryService.deletePostCategory(id);

    this.eventEmitter.emit(
      EVENTS.STATISTICS_SAVE,
      new StatisticsSaveEvent(
        API_RESOURCE.POST_CATEGORY._,
        API_METHOD.DELETE,
        currentUserId,
      ),
    );
  }
}
