import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: Repository<User>) {}

  async login() {}

  async logout() {}

  async token() {}
}
