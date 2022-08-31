import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    await this.authService.login(loginDto);
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
