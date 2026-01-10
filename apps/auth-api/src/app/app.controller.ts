import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDto, SignupDto } from '@social-media-monorepo/shared-dto';
import { JwtAuthGuard } from '@social-media-monorepo/shared-auth-utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.appService.createUser(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.appService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }
}
