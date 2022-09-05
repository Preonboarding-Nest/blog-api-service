import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PostCategory } from '../entities/post-category.entity';
import { Post } from '../entities/post.entity';

export class CreatePostDto {
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  toEntity(postCategory: PostCategory) {
    const post = new Post();
    post.title = this.title;
    post.content = this.content;
    post.postCategory = postCategory;
    return post;
  }
}
