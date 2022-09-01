import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { PostCategory } from './post-category.entity';

@Entity()
export class Post {
  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '해당 컬럼은 게시글의 제목을 나타냅니다.',
  })
  title: string;

  @Column({
    type: 'text',
    comment: '해당 컬럼은 게시글의 내용을 나타냅니다.',
  })
  content: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    comment: '해당 컬럼은 게시글의 등록일을 나타냅니다.',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    comment: '해당 컬럼은 게시글의 수정일을 나타냅니다.',
  })
  updatedAt: Date;

  @Column({
    default: false,
    comment: '해당 컬럼은 게시글이 삭제되었는지 여부를 나타냅니다.',
  })
  isDeleted: boolean;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToOne(() => PostCategory, (postCategory) => postCategory.posts)
  postCategory: PostCategory;
}
