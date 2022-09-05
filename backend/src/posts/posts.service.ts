import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { FindPostResponseDto } from './dto/find-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostCategory } from './entities/post-category.entity';
import { ROLE_ENUM } from '../users/entities/enums';
import { POST_TYPE_ENUM } from '../commons/enums/commons.enums';

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

  /**
   * [게시글 종류별 접근 권한 체크]
   * 모든 게시판의 UD는 사용자 권한에 상관없이 본인이 작성한 글만 접근 가능하다.
   * 자유 게시판: (운영자 CRUD, 유저: CRUD)
   * 공지 게시판: (운영자 CRUD, 유저: R)
   * 운영 게시판: (운영자 CRUD)
   */

  /**
   * 게시글을 등록
   * @param currentUserId 현재 로그인한 사용자의 id
   * @param createPostDto 게시글 등록용 DTO
   * @returns 등록된 게시글의 id와 게시글 type
   */
  async create(
    currentUserId: number,
    createPostDto: CreatePostDto,
  ): Promise<{ id: number; type: number }> {
    const post = new Post();
    const categoryId = createPostDto.categoryId;
    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId, isDeleted: false },
    });
    const postCategory = await this.postCategoryRepository.findOneBy({
      id: categoryId,
    });

    if (!currentUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (!postCategory) {
      throw new NotFoundException('게시글 종류를 찾을 수 없습니다.');
    }
    if (
      currentUser.role === ROLE_ENUM.USER &&
      postCategory.id === POST_TYPE_ENUM.NOTICE
    ) {
      throw new ForbiddenException('공지 게시판의 접근 권한이 없습니다.');
    }
    if (
      currentUser.role === ROLE_ENUM.USER &&
      postCategory.id === POST_TYPE_ENUM.PROD
    ) {
      throw new ForbiddenException('운영 게시판의 접근 권한이 없습니다.');
    }

    post.title = createPostDto.title;
    post.content = createPostDto.content;
    post.postCategory = postCategory;
    post.user = currentUser;

    const savedPost = await this.postRepository.save(post);
    return {
      id: savedPost.id,
      type: savedPost.postCategory.id,
    };
  }

  /**
   * 게시글 목록 조회
   * @param currentUserId 현재 로그인한 사용자의 id
   * @param categoryId 조회할 게시글 종류 id
   * @returns 게시글 상세 배열 DTO
   */
  async findAll(
    currentUserId: number,
    categoryId: number,
  ): Promise<{ posts: FindPostResponseDto[]; type: number }> {
    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId, isDeleted: false },
    });
    const postCategory = await this.postCategoryRepository.findOneBy({
      id: categoryId,
    });

    if (!currentUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    if (!postCategory) {
      throw new NotFoundException('게시글 종류를 찾을 수 없습니다.');
    }
    if (
      currentUser.role === ROLE_ENUM.USER &&
      postCategory.id === POST_TYPE_ENUM.PROD
    ) {
      throw new ForbiddenException('운영 게시판에 접근 권한이 없습니다.');
    }

    const posts: Post[] = await this.postRepository.find({
      where: { isDeleted: false, postCategory },
      relations: ['user'],
    });

    return {
      posts: posts.map((p) => new FindPostResponseDto().of(p)),
      type: postCategory.id,
    };
  }

  /**
   * 게시글 상세 조회
   * @param currentUserId 현재 로그인한 사용자의 id
   * @param postId 조회할 게시글 상세 id
   * @param categoryId 조회할 게시글 종류 id
   * @returns 게시글 상세 DTO
   */
  async findOne(
    currentUserId: number,
    postId: number,
    categoryId: number,
  ): Promise<{ post: FindPostResponseDto; type: number }> {
    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId, isDeleted: false },
    });
    const postCategory = await this.postRepository.findOneBy({
      id: categoryId,
    });
    const post: Post = await this.postRepository.findOne({
      where: { id: postId, isDeleted: false },
      relations: ['user'],
    });

    if (!currentUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    if (!postCategory) {
      throw new NotFoundException('게시글 종류를 찾을 수 없습니다.');
    }
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (
      currentUser.role === ROLE_ENUM.USER &&
      postCategory.id === POST_TYPE_ENUM.PROD
    ) {
      throw new ForbiddenException('운영 게시판에 접근 권한이 없습니다.');
    }

    return {
      post: new FindPostResponseDto().of(post),
      type: postCategory.id,
    };
  }

  /**
   * 게시글 수정
   * @param currentUserId 현재 로그인한 사용자의 id
   * @param postId 수정할 게시글 상세 id
   * @param updatePostDto 수정할 내용을 담고있는 DTO
   */
  async update(
    currentUserId: number,
    postId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<void> {
    const { title, content } = updatePostDto;
    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId, isDeleted: false },
    });
    const post: Post = await this.postRepository.findOne({
      where: { id: postId, isDeleted: false },
      relations: ['user'],
    });

    if (!currentUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    if (post.user.id !== currentUserId) {
      throw new ForbiddenException('본인이 작성한 게시글이 아닙니다.');
    }

    // 기존 게시글의 내용을 모두 전송한다고 가정하고 구현
    await this.postRepository.update(postId, { title, content });
  }

  /**
   * 게시글 삭제
   * @param currentUserId 현재 로그인한 사용자의 id
   * @param postId 삭제할 게시글 상세 id
   */
  async remove(currentUserId: number, postId: number): Promise<void> {
    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId, isDeleted: false },
    });
    const post = await this.postRepository.findOne({
      where: { id: postId, isDeleted: false },
      relations: ['user'],
    });

    if (!currentUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    if (post.user.id !== currentUserId) {
      throw new ForbiddenException('본인이 작성한 게시글이 아닙니다.');
    }

    await this.postRepository.update(postId, { isDeleted: true });
  }
}
