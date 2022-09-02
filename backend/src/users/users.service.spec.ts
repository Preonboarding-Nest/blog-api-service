import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GENDER_ENUM } from './entities/enums';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockUserRepository = () => {
  const users: User[] = [];

  return {
    create: jest.fn().mockImplementation((user) => user),
    save: jest.fn().mockImplementation((user) => {
      users.push(user);
      console.log('users', users);
      return user;
    }),
    find: jest.fn(),
    findOne: jest.fn().mockImplementation((query) => {
      const where = query.where;

      let existingUser: User;

      if (where.email) {
        console.log(where.email);
        users.forEach((user) => {
          if (user.email === where.email) {
            console.log('match');
            existingUser = user;
          }
        });
      }

      return existingUser;
    }),
  };
};

const mockAuthService = () => ({});
const mockRedisService = () => ({
  delKey: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
        {
          provide: AuthService,
          useValue: mockAuthService(),
        },
        {
          provide: RedisService,
          useValue: mockRedisService(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const users: User[] = [];

    const password = 'tester123!';
    const userInfo: CreateUserDto = {
      email: 'test@test.com',
      password,
      phone: '01012341234',
      age: 28,
      gender: GENDER_ENUM.MALE,
    };
    const user = await service.createUser(userInfo);

    expect(user.password).not.toEqual(password);
  });

  it('throws an exception if user tries to create a new user with email that is in use', async () => {
    const password = 'tester123!';
    const userInfo: CreateUserDto = {
      email: 'test@test.com',
      password,
      phone: '01012341234',
      age: 28,
      gender: GENDER_ENUM.MALE,
    };

    const user = await service.createUser(userInfo);

    console.log(user);

    await expect(service.createUser(userInfo)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
