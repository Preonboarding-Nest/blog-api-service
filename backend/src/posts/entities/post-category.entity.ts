import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '해당 컬럼은 게시글 종류의 이름을 나타냅니다.',
  })
  type: string;
}
