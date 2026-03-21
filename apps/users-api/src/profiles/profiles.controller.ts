import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard, CurrentUser } from '@social-media-monorepo/shared-auth-utils';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.profilesService.create(dto);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.profilesService.search(query || '');
  }

  @Get('id/:userId')
  getByUserId(@Param('userId') userId: string) {
    return this.profilesService.getByUserId(userId);
  }

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.profilesService.getByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.profilesService.update(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':userId/follow')
  toggleFollow(@Param('userId') targetUserId: string, @CurrentUser() user: any) {
    return this.profilesService.toggleFollow(targetUserId, user.userId);
  }
}
