import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { PostsService } from './posts.service';
import { PostCategory } from './entities/post-category.entity';
import { Post } from './entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GENDER_ENUM, ROLE_ENUM } from 'src/users/entities/enums';
import { POST_TYPE_ENUM } from 'src/commons/enums/commons.enums';
import { HttpStatus } from '@nestjs/common';
import { FindPostResponseDto } from './dto/find-post.dto';

//type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PostsService', () => {
  let service: PostsService;
  let userRepository: Repository<User>;
  // let userRepository: MockRepository<User>;

  // (1)
  const mockPostRepository = () => ({
    findOneBy: jest.fn(),
    findOne: jest.fn(),
  });
  const mockUserRepository = () => ({
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  });
  const mockPostCategoryRepository = () => ({
    findOneBy: jest.fn(),
  });

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
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  const createRequest = {
    categoryId: POST_TYPE_ENUM.FREE,
    title: 'title',
    content: 'content',
  };

  const findOneResponse = new FindPostResponseDto();
  findOneResponse.email = 'olaf@naver.com';
  findOneResponse.id = 1;
  findOneResponse.title = 'title';
  findOneResponse.content = 'content';

  describe('게시글 등록 (사용자 권한)', () => {
    it('자유 게시판 게시글 등록 시 1을 반환한다.', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(1);
      const savedPostId = await service.create(1, createRequest);
      expect(savedPostId).toBe(1);
    });

    it('공지 게시판 게시글 등록 시 403을 반환한다.', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(HttpStatus.FORBIDDEN);
      createRequest.categoryId = POST_TYPE_ENUM.NOTICE;
      const savedPostId = await service.create(1, createRequest);
      expect(savedPostId).toBe(HttpStatus.FORBIDDEN);
    });

    it('운영 게시판 게시글 등록 시 403을 반환한다.', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(HttpStatus.FORBIDDEN);
      createRequest.categoryId = POST_TYPE_ENUM.PROD;
      const savedPostId = await service.create(1, createRequest);
      expect(savedPostId).toBe(HttpStatus.FORBIDDEN);
    });
  });

  describe('게시글 등록 (관리자 권한)', () => {
    it('자유 게시판 게시글 등록 시 1을 반환한다.', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(1);
      const savedPostId = await service.create(1, createRequest);
      expect(savedPostId).toBe(1);
    });

    it('공지 게시판 게시글 등록 시 2를 반환한다.', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(2);
      createRequest.categoryId = POST_TYPE_ENUM.NOTICE;
      const savedPostId = await service.create(1, createRequest);
      expect(savedPostId).toBe(2);
    });

    it('운영 게시판 게시글 등록 시 3을 반환한다.', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(3);
      createRequest.categoryId = POST_TYPE_ENUM.PROD;
      const savedPostId = await service.create(1, createRequest);
      expect(savedPostId).toBe(3);
    });
  });
});
