import { Body, Controller, Get, Param, Post, Patch, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import { Profile } from '@social-media-monorepo/shared-models';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('profiles')
  async createProfile(@Body() data: Partial<Profile>) {
    return this.appService.createProfile(data);
  }

  @Get('profiles/:username')
  async getProfile(@Param('username') username: string) {
    const profile = await this.appService.getProfile(username);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  @Patch('profiles/:userId')
  async updateProfile(@Param('userId') userId: string, @Body() data: Partial<Profile>) {
    return this.appService.updateProfile(userId, data);
  }
}
