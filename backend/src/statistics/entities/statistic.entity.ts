import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: '해당 컬럼은 API 요청 정보를 나타냅니다.',
  })
  resource: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: '해당 컬럼은 API 요청 method를 나타냅니다.',
  })
  method: string;

  @Column({
    type: 'int',
    comment: '해당 컬럼은 데이터 저장 년도(YYYY)를 나타냅니다.',
  })
  year: number;

  @Column({
    type: 'int',
    comment: '해당 컬럼은 데이터 저장 월(1~12)을 나타냅니다.',
  })
  month: number;

  @Column({
    type: 'int',
    comment: '해당 컬럼은 데이터 저장 일자(0~31)를 나타냅니다.',
  })
  date: number;

  @Column({
    type: 'int',
    comment: '해당 컬럼은 데이터 저장 시간(0~23)을 나타냅니다.',
  })
  hour: number;

  @Column({
    type: 'int',
    comment: '해당 컬럼은 데이터 저장 분(0~59)을 나타냅니다.',
  })
  min: number;

  @Column({
    type: 'int',
    comment: '해당 컬럼은 데이터 저장 초(0~59)를 나타냅니다.',
  })
  sec: number;

  @ManyToOne(() => User, (user) => user.statistics)
  user: User;
}
