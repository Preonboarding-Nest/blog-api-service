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
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostCategoryDto } from './dto/create-postCategory.dto';
import { UpdatePostCategoryDto } from './dto/update-postCategory.dto';
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
    description: '게시글 종류 조회 성공',
    type: PostCategory,
    isArray: true,
  })
  @Get()
  async findAllPostCategories(): Promise<PostCategory[]> {
    return this.postsCategoryService.findAllPostCategories();
  }

  @ApiOperation({ summary: '게시글 종류 수정 API' })
  @ApiOkResponse({
    description: '게시글 종류 수정 성공',
    type: PostCategory,
  })
  @Patch('/:id')
  updatePostCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostCategoryDto: UpdatePostCategoryDto,
  ): Promise<PostCategory> {
    return this.postsCategoryService.updatePostCategory(
      id,
      updatePostCategoryDto,
    );
  }

  @ApiOperation({ summary: '게시글 종류 삭제 API' })
  @ApiOkResponse({
    description: '게시글 종류 삭제 성공',
  })
  @Delete('/:id')
  deletePostCategory(@Param('id', ParseIntPipe) id: number): void {
    this.postsCategoryService.deletePostCategory(id);
  }
}
