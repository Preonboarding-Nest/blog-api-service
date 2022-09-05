import { BadRequestException, NotFoundException } from '@nestjs/common';
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
    find: jest.fn().mockImplementation(() => {
      return categories;
    }),
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

      if (where.id) {
        categories.forEach((category) => {
          if (category.id === where.id) {
            existingPostCategory = category;
          }
        });
      }

      return existingPostCategory;
    }),
    remove: jest.fn().mockImplementation((category) => {
      const index = categories.findIndex((c, index) => {
        if (c.id === category.id) {
          return true;
        }
      });

      categories.splice(index, 1);
    }),
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

  it('should return post categories list', async () => {
    await service.createPostCategory({ type: '자유게시판' });
    await service.createPostCategory({ type: '공지사항' });
    await service.createPostCategory({ type: '운영게시판' });

    const categories = await service.findAllPostCategories();
    expect(categories).toHaveLength(3);
  });

  it('throws exception if user tries to updte a non-existing post', async () => {
    await expect(
      service.updatePostCategory(9999, { type: 'New' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should update a post category', async () => {
    const postCategory = await service.createPostCategory({ type });

    const updatedPostCategory = await service.updatePostCategory(
      postCategory.id,
      { type: 'Updated' },
    );

    expect(updatedPostCategory.type).toEqual('Updated');
  });

  it('throws exception if user tries to delete non-existing post category.', async () => {
    await expect(service.deletePostCategory(9999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should delete a post category with a given id', async () => {
    const { id } = await service.createPostCategory({ type });

    const categoriesBeforeDelete = await service.findAllPostCategories();
    expect(categoriesBeforeDelete.length).toEqual(1);

    await service.deletePostCategory(id);
    const categories = await service.findAllPostCategories();
    expect(categories.length).toEqual(0);
  });
});
