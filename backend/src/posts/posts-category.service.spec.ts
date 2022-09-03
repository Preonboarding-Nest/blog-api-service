import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostCategory } from './entities/post-category.entity';
import { PostsCategoryService } from './posts-category.service';

const mockPostCategoryRepository = () => {
  const categories: PostCategory[] = [];

  return {
    create: jest.fn().mockImplementation(({ type }) => {
      return {
        id: Math.random(),
        type,
      };
    }),
    save: jest.fn().mockImplementation((category) => {
      categories.push(category);
      return category;
    }),
    find: jest.fn(),
    findOne: jest.fn().mockImplementation((query) => {
      const where = query.where;

      let existingPostCategory: PostCategory;

      if (where.type) {
        categories.forEach((category) => {
          if (category.type === where.type) {
            existingPostCategory = category;
          }
        });
      }

      return existingPostCategory;
    }),
    remove: jest.fn(),
  };
};

describe('PostsCategoryService', () => {
  let service: PostsCategoryService;
  let postCategoryRepository: Repository<PostCategory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsCategoryService,
        {
          provide: getRepositoryToken(PostCategory),
          useValue: mockPostCategoryRepository(),
        },
      ],
    }).compile();

    service = module.get<PostsCategoryService>(PostsCategoryService);
    postCategoryRepository = module.get(getRepositoryToken(PostCategory));
  });

  const type = '자유게시판';

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new post category', async () => {
    const postCategory = await service.createPostCategory({ type });

    expect(postCategory.type).toEqual(type);
  });

  it('throws exception if user tries to create a new post category whose type is already exists.', async () => {
    await service.createPostCategory({ type });

    await expect(service.createPostCategory({ type })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
