import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostCategoryDto } from './dto/create-postCategory.dto';
import { UpdatePostCategoryDto } from './dto/update-postCategory.dto';
import { PostCategory } from './entities/post-category.entity';

@Injectable()
/**
 * 이 클래스는 PostsCategory Service를 정의합니다.
 */
export class PostsCategoryService {
  /**
   *
   * @param postCategoryRepository PostCategory Repository 인스턴스
   */
  constructor(
    @InjectRepository(PostCategory)
    private postCategoryRepository: Repository<PostCategory>,
  ) {}

  /**
   * 새롷운 게시글 유형을 생성합니다.
   * @param createPostCategoryDto 게시글 유형 생성을 위한 정보 { categoryId, title, content}
   * @returns 생성된 PostCategory를 반환합니다.
   */
  async createPostCategory(
    createPostCategoryDto: CreatePostCategoryDto,
  ): Promise<PostCategory> {
    const { type } = createPostCategoryDto;
    const existingPostCategory = await this.postCategoryRepository.findOne({
      where: { type },
    });

    // 이미 존재하는 post category type 생성 요청시 예외를 발생시킵니다.
    if (existingPostCategory) {
      throw new BadRequestException('Post Category already exists.');
    }

    const postCategory = await this.postCategoryRepository.create({ type });

    return await this.postCategoryRepository.save(postCategory);
  }

  /**
   * 모든 게시글 유형 리스트를 조회합니다.
   * @returns 저장되어 있는 모든 PostCategory를 반환합니다.
   */
  async findAllPostCategories(): Promise<PostCategory[]> {
    const postCategories = await this.postCategoryRepository.find();
    return postCategories;
  }

  /**
   * 게시글 유형을 수정합니다.
   * @param id 수정하고자 하는 게시글 유형의 id
   * @param updatePostCategoryDto 게시글 유형 수정을 위한 정보 { type }
   * @returns 수정된 PostCategory를 반환합니다.
   */
  async updatePostCategory(
    id: number,
    updatePostCategoryDto: UpdatePostCategoryDto,
  ): Promise<PostCategory> {
    const postCategory = await this.postCategoryRepository.findOne({
      where: { id },
    });

    // 요청된 ID를 가진 PostCategory 가 없는 경우 예외를 발생시킵니다.
    if (!postCategory) {
      throw new NotFoundException('Post category not found.');
    }

    postCategory.type = updatePostCategoryDto.type;

    return await this.postCategoryRepository.save(postCategory);
  }

  /**
   * 요청된 id를 가진 게시글 유형을 삭제합니다.
   * @param id 삭제하고자 하는 게시글 유형 id
   */
  async deletePostCategory(id: number): Promise<void> {
    const postCategory = await this.postCategoryRepository.findOne({
      where: { id },
    });

    // 요청된 id를 가지는 게시글 유형이 없는 경우 예외를 발생시킵니다.
    if (!postCategory) {
      throw new NotFoundException('Post category not found.');
    }

    await this.postCategoryRepository.remove(postCategory);
  }
}
