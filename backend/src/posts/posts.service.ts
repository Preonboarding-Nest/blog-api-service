import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { FindPostResponseDto } from './dto/find-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<void> {
    // Todo 게시글 종류 모델이 개발되면 연관관게 설정 후 저장하도록 변경 예정
    const post = new Post(createPostDto.title, createPostDto.content);
    await this.postRepository.save(post);
  }

  async findAll(): Promise<FindPostResponseDto[]> {
    // Todo 사용자 모델이 개발되면 사용자 정보도 응답해주도록 변경 예정
    const post: Post[] = await this.postRepository.find();
    return post.map(
      (p) =>
        new FindPostResponseDto(
          p.id,
          p.title,
          p.content,
          p.createdAt,
          p.updatedAt,
        ),
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
