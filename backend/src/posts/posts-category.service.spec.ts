import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostCategory } from './entities/post-category.entity';
import { PostsCategoryService } from './posts-category.service';

const mockPostCategoryRepository = () => {
  const categories: PostCategory[] = [];

  return {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
