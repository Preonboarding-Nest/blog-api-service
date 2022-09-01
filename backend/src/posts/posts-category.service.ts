import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostCategoryDto } from './dto/create-postCategory.dto';
import { PostCategory } from './entities/post-category.entity';

@Injectable()
export class PostsCategoryService {
  constructor(
    @InjectRepository(PostCategory)
    private postCategoryRepository: Repository<PostCategory>,
  ) {}

  async createPostCategory(
    createPostCategoryDto: CreatePostCategoryDto,
  ): Promise<PostCategory> {
    const { type } = createPostCategoryDto;
    const existingPostCategory = await this.postCategoryRepository.findOne({
      where: { type },
    });

    if (existingPostCategory) {
      throw new NotAcceptableException('Post Category already exists.');
    }

    const postCategory = await this.postCategoryRepository.create({ type });

    return await this.postCategoryRepository.save(postCategory);
  }

  async findAllPostCategories(): Promise<PostCategory[]> {
    const postCategories = await this.postCategoryRepository.find();
    return postCategories;
  }
}
