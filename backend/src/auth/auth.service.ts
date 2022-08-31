import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findUserByEmail(email: string): Promise<User> {
    try {
      const user: User = await this.userRepository.findOne({
        where: { email },
      });
      return user;
    } catch (error) {
      throw new NotFoundException('회원 정보를 조회하지 못했습니다.');
    }
  }

  async login(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;
    const user: User = await this.findUserByEmail(email);
    if (!user) throw new NotFoundException('회원이 존재하지 않습니다.');

    const isPwMatching: boolean = await bcrypt.compare(password, user.password);
    if (!isPwMatching)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    await this.makeTokens(email, user.id);
    // redis에 저장

    return user;
  }

  async makeTokens(email: string, id: number) {}

  async logout() {
    // logout
    return 'logout!';
  }

  async token() {
    // token
    return 'token!';
  }
}
