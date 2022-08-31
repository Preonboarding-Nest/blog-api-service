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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindPostResponseDto } from './dto/find-post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '게시글 등록 API' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '게시글 등록 성공',
  })
  @Post()
  create(@Body() createPostDto: CreatePostDto): void {
    this.postsService.create(createPostDto);
  }

  @ApiOperation({ summary: '게시글 목록 조회 API' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글 목록 조회 성공',
    type: FindPostResponseDto,
  })
  @Get()
  async findAll(): Promise<FindPostResponseDto[]> {
    return await this.postsService.findAll();
  }

  @ApiOperation({ summary: '게시글 상세 조회 API' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글 상세 조회 성공',
    type: FindPostResponseDto,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FindPostResponseDto> {
    return await this.postsService.findOne(id);
  }

  @ApiOperation({ summary: '게시글 수정 API' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글 수정 성공',
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    await this.postsService.update(id, updatePostDto);
  }

  @ApiOperation({ summary: '게시글 삭제 API' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글 삭제 성공',
  })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.postsService.remove(id);
  }
}
