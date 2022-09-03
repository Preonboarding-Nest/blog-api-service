import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { PostsService } from './posts.service';
import { PostCategory } from './entities/post-category.entity';
import { Post } from './entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PostsService', () => {
  let service: PostsService;

  // (1)
  const mockPostRepository = () => ({});
  const mockUserRepository = () => ({});
  const mockPostCategoryRepository = () => ({});

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        // (2)
        { provide: getRepositoryToken(Post), useValue: mockPostRepository() },
        { provide: getRepositoryToken(User), useValue: mockUserRepository() },
        {
          provide: getRepositoryToken(PostCategory),
          useValue: mockPostCategoryRepository(),
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
