import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async login(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;
    const user: User = await this.findUserByEmail(email);
    if (!user) throw new NotFoundException('회원이 존재하지 않습니다.');

    const isPwMatching: boolean = await bcrypt.compare(password, user.password);
    if (!isPwMatching)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    // 토큰 발급
    await this.makeTokens();
    // redis에 저장

    return user;
  }

  async makeTokens() {}

  async logout() {
    // logout
    return 'logout!';
  }

  async token() {
    // token
    return 'token!';
  }
}
