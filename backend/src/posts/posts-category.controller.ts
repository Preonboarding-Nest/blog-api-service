import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostCategoryDto } from './dto/create-postCategory.dto';
import { PostCategory } from './entities/post-category.entity';
import { PostsCategoryService } from './posts-category.service';

@ApiTags('Posts API')
@Controller('posts/categories')
export class PostsCategoryController {
  constructor(private postsCategoryService: PostsCategoryService) {}

  @ApiOperation({ summary: '게시글 종류 등록 API' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '게시글 종류 등록 성공',
  })
  @Post()
  createPostCategory(
    @Body() createPostCategoryDto: CreatePostCategoryDto,
  ): void {
    this.postsCategoryService.createPostCategory(createPostCategoryDto);
  }

  @ApiOperation({ summary: '게시글 종류 조회 API' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: '게시글 종류 조회 성공',
    type: PostCategory,
    isArray: true,
  })
  @Get()
  async findAllPostCategories(): Promise<PostCategory[]> {
    return this.postsCategoryService.findAllPostCategories();
  }
}
