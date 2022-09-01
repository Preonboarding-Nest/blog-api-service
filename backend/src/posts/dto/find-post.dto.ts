import { Post } from '../entities/post.entity';

export class FindPostResponseDto {
  email: string;
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  of(post: Post) {
    this.email = post.user.email;
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
    return this;
  }
}
