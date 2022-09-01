import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { FindPostResponseDto } from './dto/find-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostCategory } from './entities/post-category.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PostCategory)
    private readonly postCategoryRepository: Repository<PostCategory>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<number> {
    // Todo 게시글 종류 모델이 개발되면 연관관게 설정 후 저장하도록 변경 예정
    // Todo 생성자를 toEntity()를 사용하면 좋을 듯 하다.
    const postCategory = this.postCategoryRepository.findOneBy({
      id: createPostDto.categoryId,
    });
    if (!postCategory) {
      throw new NotFoundException(
        `postCategory not found, id = ${createPostDto.categoryId}`,
      );
    }

    const post = new Post(createPostDto.title, createPostDto.content);
    // 임시로 2번 회원으로 설정하여 저장
    post.user = await this.userRepository.findOneBy({ id: 2 });
    const savedPost = await this.postRepository.save(post);
    return savedPost.id;
  }

  async findAll(): Promise<FindPostResponseDto[]> {
    const posts: Post[] = await this.postRepository.find({
      relations: ['user'],
    });
    return posts
      .filter((p) => p.isDeleted === false)
      .map((p) => new FindPostResponseDto().of(p));
  }

  async findOne(id: number): Promise<FindPostResponseDto> {
    const post: Post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post || post.isDeleted) {
      throw new NotFoundException(`post not found, id = ${id}`);
    }
    return new FindPostResponseDto().of(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<void> {
    const { title, content } = updatePostDto;
    const post: Post = await this.postRepository.findOneBy({ id });
    if (!post || post.isDeleted) {
      throw new NotFoundException(`post not found, id = ${id}`);
    }
    // 기존 게시글의 내용을 모두 전송한다고 가정하고 구현
    await this.postRepository.update(id, { title, content });
  }

  async remove(id: number): Promise<void> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post || post.isDeleted) {
      throw new NotFoundException(`post not found, id = ${id}`);
    }
    await this.postRepository.update(id, { isDeleted: true });
  }
}
