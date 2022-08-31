import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login() {
    await this.authService.login();
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
