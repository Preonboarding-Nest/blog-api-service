import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '해당 컬럼은 게시글 종류의 이름을 나타냅니다.',
    unique: true,
  })
  type: string;

  @OneToMany(() => Post, (post) => post.postCategory)
  posts: Post[];
}
