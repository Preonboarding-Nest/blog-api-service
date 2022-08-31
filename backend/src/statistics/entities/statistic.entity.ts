import { HTTP_METHOD_ENUM } from '../../commons/enums/commons.enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '해당 컬럼은 API 요청 경로를 나타냅니다.',
  })
  path: string;

  @Column({
    type: 'enum',
    enum: HTTP_METHOD_ENUM,
    nullable: false,
    comment: '해당 컬럼은 http method를 나타냅니다.',
  })
  method: HTTP_METHOD_ENUM;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'now()',
    comment: '해당 컬럼은 요청 시간을 나타냅니다.',
  })
  timestamp: Date;
}
