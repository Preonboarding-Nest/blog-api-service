import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { GENDER_ENUM, ROLE_ENUM } from 'src/users/entities/enums';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { Tokens } from './types';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

const mockJwtRepository = () => ({
  signAsyn: jest.fn(),
});

const mockRedisRepository = () => ({
  delKey: jest.fn(),
  setKey: jest.fn(),
  getKey: jest.fn(),
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
  });

  const res = {
    status: jest.fn(() => res),
  };

  const userDummy: User = {
    id: 5,
    email: 'test@email.com',
    password: 'tester1234',
    gender: GENDER_ENUM.FEMALE,
    age: 25,
    phone: '01000000000',
    createdAt: new Date('2022-08-31 11:22:11.876'),
    updatedAt: new Date('2022-08-31 11:22:11.876'),
    lastAccessedAt: new Date('2022-08-31 11:22:11.876'),
    isDeleted: false,
    role: ROLE_ENUM.USER,
    posts: [],
  };

  const tokens: Tokens = {
    accessToken: 'testAccessToken',
    refreshToken: 'testRefreshToken',
  };

  describe('findUser', () => {
    it('return user by email', async () => {
      const userSpy = jest
        .spyOn(service, 'findUserByEmail')
        .mockResolvedValue(userDummy);

      const user = await service.findUserByEmail(userDummy.email);
      res.status.mockReturnValue(200);

      expect(userSpy).toHaveBeenCalledWith('test@email.com');
      expect(user).toEqual(userDummy);
      expect(res.status()).toBe(200);
    });

    it('return 404 error for finding user by email', async () => {
      jest.spyOn(service, 'findUserByEmail').mockResolvedValue(userDummy);

      await service.findUserByEmail(userDummy.email);
      res.status.mockReturnValue(404);

      expect(res.status()).toBe(404);
    });

    it('return user by id', async () => {
      const userSpy = jest
        .spyOn(service, 'findUserById')
        .mockResolvedValue(userDummy);

      const user = await service.findUserById(userDummy.id);
      res.status.mockReturnValue(200);

      expect(userSpy).toHaveBeenCalledWith(5);
      expect(user).toEqual(userDummy);
      expect(res.status()).toBe(200);
    });

    it('return 404 error for finding user by id', async () => {
      jest.spyOn(service, 'findUserById').mockResolvedValue(userDummy);

      await service.findUserById(userDummy.id);
      res.status.mockReturnValue(404);

      expect(res.status()).toBe(404);
    });
  });

  describe('login', () => {
    it('return tokens by email and id', async () => {
      const userSpy = jest
        .spyOn(service, 'makeTokens')
        .mockResolvedValue(tokens);

      const user = await service.makeTokens('test@email.com', 5);
      res.status.mockReturnValue(200);

      expect(userSpy).toHaveBeenCalledWith('test@email.com', 5);
      expect(user).toEqual(tokens);
      expect(res.status()).toBe(200);
    });

    it('return 401 error for making tokens', async () => {
      jest.spyOn(service, 'makeTokens').mockResolvedValue(tokens);

      await service.makeTokens('test@email.com', 5);
      res.status.mockReturnValue(401);

      expect(res.status()).toBe(401);
    });

    it('login success', async () => {
      const dto = new LoginDto();

      const userSpy = jest
        .spyOn(service, 'login')
        .mockResolvedValue({ user: userDummy, tokens });

      const user = await service.login(dto);
      res.status.mockReturnValue(200);

      expect(userSpy).toHaveBeenCalledWith(dto);
      expect(user).toEqual({ user: userDummy, tokens });
      expect(res.status()).toBe(200);
    });

    it('login failed', async () => {
      const dto = new LoginDto();

      jest
        .spyOn(service, 'login')
        .mockResolvedValue({ user: userDummy, tokens });

      await service.login(dto);
      res.status.mockReturnValue(401);

      expect(res.status()).toBe(401);
    });
  });
});
