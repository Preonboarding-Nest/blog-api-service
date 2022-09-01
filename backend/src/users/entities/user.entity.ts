import { Post } from '../../posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GENDER_ENUM, ROLE_ENUM } from './enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    type: 'varchar',
    length: 50,
    comment: '해당 컬럼은 사용자의 이메일을 나타냅니다.',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '해당 컬럼은 사용자의 패스워드를 나타냅니다.',
  })
  password: string;

  @Column({
    type: 'enum',
    name: 'gender',
    enum: GENDER_ENUM,
    comment: '해당 컬럼은 사용자의 성별을 나타냅니다.',
  })
  gender: GENDER_ENUM;

  @Column({
    type: 'int',
    comment: '해당 컬럼은 사용자의 나이를 나타냅니다.',
  })
  age: number;

  @Column({
    type: 'varchar',
    length: 15,
    comment: '해당 컬럼은 사용자의 연락처를 나타냅니다.',
  })
  phone: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    comment: '해당 컬럼은 사용자의 생성 시간을 나타냅니다.',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    comment: '해당 컬럼은 사용자의 업데이트 시간을 나타냅니다.',
  })
  updatedAt: Date;

  @Column({
    type: 'timestamp',
    name: 'last_accessed_at',
    default: () => 'now()',
    comment: '해당 컬럼은 사용자의 마지막 접속일을 나타냅니다.',
  })
  lastAccessedAt: Date;

  @Column({
    default: false,
    comment: '해당 컬럼은 사용자가 삭제되었는지 여부를 나타냅니다.',
  })
  isDeleted: boolean;

  @Column({
    type: 'enum',
    name: 'role',
    enum: ROLE_ENUM,
    default: 'user',
    comment: '해당 컬럼은 사용자의 회원등급을 나타냅니다.',
  })
  role: ROLE_ENUM;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
