import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsCategoryService } from './posts-category.service';
import { PostsCategoryController } from './posts-category.controller';
import { PostCategory } from './entities/post-category.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostCategory, User])],
  controllers: [PostsCategoryController, PostsController],
  providers: [PostsService, PostsCategoryService],
})
export class PostsModule {}
