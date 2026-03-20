import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from '@social-media-monorepo/shared-dto';
import { LoginDto } from '@social-media-monorepo/shared-dto';
import { JwtAuthGuard } from '@social-media-monorepo/shared-auth-utils';
import { CurrentUser } from '@social-media-monorepo/shared-auth-utils';
import { UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: any) {
    return user;
  }
}
