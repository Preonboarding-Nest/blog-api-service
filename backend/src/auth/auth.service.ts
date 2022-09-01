import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto';
import { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
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

  async findUserById(id: number): Promise<User> {
    try {
      const user: User = await this.userRepository.findOne({
        where: { id },
      });
      return user;
    } catch (error) {
      throw new NotFoundException('회원 정보를 조회하지 못했습니다.');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user: User = await this.findUserByEmail(email);
    if (!user) throw new ForbiddenException('회원이 존재하지 않습니다.');

    const isPwMatching: boolean = await bcrypt.compare(password, user.password);
    if (!isPwMatching)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    const tokens: Tokens = await this.makeTokens(email, user.id);

    await this.redisService.setKey(
      'refresh' + user.id.toString(),
      tokens.refreshToken,
      this.configService.get('JWT_REFRESH_EXPIRESIN'),
    );

    return { user, tokens };
  }

  async makeTokens(email: string, id: number): Promise<Tokens> {
    try {
      const jwtPayload: JwtPayload = { email, sub: id };

      const accessToken: string = await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRESIN'),
      });

      const refreshToken: string = await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRESIN'),
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException('토큰을 생성하지 못했습니다.');
    }
  }

  async logout(id: number): Promise<boolean> {
    await this.redisService.delKey('refresh' + id.toString());
    return true;
  }

  async token(id: number): Promise<string> {
    const refreshToken: string = await this.redisService.getKey(
      'refresh' + id.toString(),
    );
    try {
      if (!refreshToken)
        throw new UnauthorizedException('토큰을 가진 회원이 아닙니다.');

      const user: User = await this.findUserById(id);
      const jwtPayload: JwtPayload = { email: user.email, sub: id };

      const accessToken: string = await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRESIN'),
      });

      return accessToken;
    } catch (error) {
      throw new UnauthorizedException('토큰을 생성하지 못했습니다.');
    }
  }
}
