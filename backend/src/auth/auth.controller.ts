import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(`AuthController`);
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user: User = await this.authService.login(loginDto);
    this.logger.verbose(`login success!`);
    return {
      user: {
        id: user.id,
        email: user.email,
        gender: user.gender,
        age: user.age,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  @Post('logout')
  async logout() {
    await this.authService.logout();
  }

  @Get('token')
  async token() {
    await this.authService.token();
  }
}
