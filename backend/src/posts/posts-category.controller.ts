import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostCategoryDto } from './dto/create-postCategory.dto';
import { PostsCategoryService } from './posts-category.service';

@ApiTags('Posts API')
@Controller('posts/categories')
export class PostsCategoryController {
  constructor(private postsCategoryService: PostsCategoryService) {}

  @ApiOperation({ summary: '게시글 종류 등록 API' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '게시글 정류 등록 성공',
  })
  @Post()
  createPostCategory(
    @Body() createPostCategoryDto: CreatePostCategoryDto,
  ): void {
    this.postsCategoryService.createPostCategory(createPostCategoryDto);
  }
}
