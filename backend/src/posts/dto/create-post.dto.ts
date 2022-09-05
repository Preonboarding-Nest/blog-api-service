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
}
