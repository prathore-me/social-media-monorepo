import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDto, SignupDto } from '@social-media-monorepo/shared-dto';

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
}
