import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { Tokens } from './types';

const userEntity = new User();
const tokens: Tokens = {
  accessToken: 'testAccessToken',
  refreshToken: 'testRefreshToken',
};
const loginDto = new LoginDto();

const mockUserRepository = () => ({
  findOne: jest.fn().mockImplementationOnce(() => {
    throw new NotFoundException();
  }),
});

const mockJwtRepository = () => ({
  signAsyn: jest.fn().mockImplementationOnce(() => {
    throw new UnauthorizedException();
  }),
});

const mockRedisRepository = () => ({
  delKey: jest.fn().mockImplementationOnce(() => {
    throw new NotFoundException();
  }),
  setKey: jest.fn().mockImplementationOnce(() => {
    throw new NotFoundException();
  }),
  getKey: jest.fn().mockImplementationOnce(() => {
    throw new NotFoundException();
  }),
});

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, RedisModule.bind({ ConfigService })],
      providers: [
        AuthService,
        ConfigService,
        RedisService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
        { provide: JwtService, useValue: mockJwtRepository() },
        { provide: RedisService, useValue: mockRedisRepository() },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('findUser', () => {
    it('return user by email', async () => {
      const userSpy = jest
        .spyOn(service, 'findUserByEmail')
        .mockResolvedValue(userEntity);

      const user = await service.findUserByEmail(userEntity.email);

      expect(userSpy).toHaveBeenCalledWith(userEntity.email);
      expect(user).toEqual(userEntity);
    });

    it('return 404 error for finding user by email', async () => {
      await expect(service.findUserByEmail(userEntity.email)).rejects.toThrow(
        new NotFoundException('회원 정보를 조회하지 못했습니다.'),
      );
    });

    it('return user by id', async () => {
      const userSpy = jest
        .spyOn(service, 'findUserById')
        .mockResolvedValue(userEntity);

      const user = await service.findUserById(userEntity.id);

      expect(userSpy).toHaveBeenCalledWith(userEntity.id);
      expect(user).toEqual(userEntity);
    });

    it('return 404 error for finding user by id', async () => {
      await expect(service.findUserById(userEntity.id)).rejects.toThrow(
        new NotFoundException('회원 정보를 조회하지 못했습니다.'),
      );
    });
  });

  describe('login', () => {
    it('return tokens by email and id', async () => {
      const userSpy = jest
        .spyOn(service, 'makeTokens')
        .mockResolvedValue(tokens);

      const user = await service.makeTokens(userEntity.email, userEntity.id);

      expect(userSpy).toHaveBeenCalledWith(userEntity.email, userEntity.id);
      expect(user).toEqual(tokens);
    });

    it('return 401 error not making tokens', async () => {
      await expect(
        service.makeTokens(userEntity.email, userEntity.id),
      ).rejects.toThrow(
        new UnauthorizedException('토큰을 생성하지 못했습니다.'),
      );
    });

    it('login success', async () => {
      const userSpy = jest
        .spyOn(service, 'login')
        .mockResolvedValue({ user: userEntity, tokens });

      const user = await service.login(loginDto);

      expect(userSpy).toHaveBeenCalledWith(loginDto);
      expect(user).toEqual({ user: userEntity, tokens });
    });

    it('return 404 error not existing user', async () => {
      await expect(service.login(loginDto)).rejects.toThrow(
        new NotFoundException('회원 정보를 조회하지 못했습니다.'),
      );
    });

    it('return 404 error not setting rt to redis', async () => {
      await expect(
        service.login({ email: 'email', password: 'password' }),
      ).rejects.toThrow(
        new NotFoundException('회원 정보를 조회하지 못했습니다.'),
      );
    });
  });

  describe('logout', () => {
    it('return true by id and logout', async () => {
      const userSpy = jest.spyOn(service, 'logout').mockResolvedValue(true);

      const user = await service.logout(userEntity.id);

      expect(userSpy).toHaveBeenCalledWith(userEntity.id);
      expect(user).toEqual(true);
    });

    it('return 404 error not removing rt to redis', async () => {
      await expect(service.logout(5)).rejects.toThrow(new NotFoundException());
    });
  });

  describe('token', () => {
    it('return accesstoken by id and refresh', async () => {
      const userSpy = jest
        .spyOn(service, 'token')
        .mockResolvedValue(tokens.accessToken);

      const user = await service.token(userEntity.id);

      expect(userSpy).toHaveBeenCalledWith(userEntity.id);
      expect(user).toEqual(tokens.accessToken);
    });

    it('return 404 error not getting rt to redis', async () => {
      await expect(service.token(5)).rejects.toThrow(new NotFoundException());
    });
  });
});
