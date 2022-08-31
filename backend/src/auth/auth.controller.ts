import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('signin')
  async create() {}

  @Post('logout')
  async logout() {}

  @Get('token')
  async token() {}
}
function ApiTags(arg0: string) {
  throw new Error('Function not implemented.');
}
