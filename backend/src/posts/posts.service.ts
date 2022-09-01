import { Injectable, NotFoundException } from '@nestjs/common';
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
    const posts: Post[] = await this.postRepository.find();
    return posts
      .filter((p) => p.isDeleted === false)
      .map((p) => new FindPostResponseDto().of(p));
  }

  async findOne(id: number): Promise<FindPostResponseDto> {
    // Todo 사용자 모델이 개발되면 사용자 정보도 응답해주도록 변경 예정
    const post: Post = await this.postRepository.findOneBy({ id });
    if (!post || post.isDeleted) {
      throw new NotFoundException(`post not found, id = ${id}`);
    }
    return new FindPostResponseDto().of(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<void> {
    const post: Post = await this.postRepository.findOneBy({ id });
    if (!post || post.isDeleted) {
      throw new NotFoundException(`post not found, id = ${id}`);
    }
    // 기존 게시글의 내용을 모두 전송한다고 가정하고 구현
    await this.postRepository.update(id, {
      title: updatePostDto.title,
      content: updatePostDto.content,
    });
  }

  async remove(id: number): Promise<void> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post || post.isDeleted) {
      throw new NotFoundException(`post not found, id = ${id}`);
    }
    await this.postRepository.update(id, { isDeleted: true });
  }
}
