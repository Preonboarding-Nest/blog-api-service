import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { RedisService } from '../redis/redis.service';

/**
 * 이 클래스는 UserService를 정의합니다.
 */
@Injectable()
export class UsersService {
  /**
   *
   * @param userRepository User Repository  인스턴스
   * @param authService AuthService 인스턴스
   * @param redisService  RedisService 인스턴스
   */
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private authService: AuthService,
    private redisService: RedisService,
  ) {}

  /**
   * 새로운 회원을 생성합니다.
   * @param createUserDto 유저 생성을 위한 정보 { email, password, gender, age, phone }
   * @returns 생성된 User 정보를 반환합니다.
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    // 이미 사용중인 이메일을 제출할 경우 회원 생성을 중단하고 예외를 발생시킵니다.
    if (existingUser) {
      throw new BadRequestException('User already exists.');
    }

    // 제출된 회원의 패스워드를 해싱하여 저장합니다.
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  /**
   * id 로 User를 조회합니다.
   * @param id 조회하고자 하는 user의 id
   * @returns 제출한 id를 가지는 User
   */
  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    // 제출한 id를 가지는 user가 없거나 user가 삭제된 경우 예외를 발생시킵니다.
    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  /**
   * id로 User를 삭제합니다.
   * @param id 삭제하고자 하는 user의 id
   */
  async removeUserById(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    // 제출한 id를 가지는 user가 없을 시 예외를 발생시킵니다.
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // user의 isDeleted를 true로 바꾸고
    // redis에 캐싱되어 있는 user의 refresh token을 제거합니다.
    user.isDeleted = true;
    await this.authService.logout(id);
    await this.userRepository.save(user);
    await this.redisService.delKey('refresh' + id.toString());
  }
}
