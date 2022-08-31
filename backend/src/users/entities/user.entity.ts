import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender, Role } from '../entities/enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', name: 'gender', enum: Gender })
  gender: Gender;

  @Column()
  age: number;

  @Column()
  phone: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column()
  lastAccessedAt: Date;

  @Column()
  isDeleted: boolean;

  @Column({ type: 'enum', name: 'role', enum: Role })
  role: Role;
}
