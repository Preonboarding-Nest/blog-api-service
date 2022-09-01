import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../entities/post.entity';

export class FindPostResponseDto {
  @ApiProperty({
    example: 'olaf@naver.com',
    description: '해당 필드는 게시글 등록자의 이메일입니다.',
  })
  email: string;

  @ApiProperty({
    example: 1,
    description: '해당 필드는 게시글의 고유 번호입니다.',
  })
  id: number;

  @ApiProperty({
    example: '오라클 SQL과 PL/SQL을 다루는 기술',
    description: '해당 필드는 게시글의 제목입니다.',
  })
  title: string;

  @ApiProperty({
    example: '해당 보드를 클릭하고...',
    description: '해당 필드는 게시글의 내용입니다.',
  })
  content: string;

  @ApiProperty({
    description: '해당 필드는 게시글의 등록일입니다.',
  })
  createdAt: Date;

  @ApiProperty({
    description: '해당 필드는 게시글의 수정일입니다.',
  })
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
