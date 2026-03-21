import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { JwtStrategy, JwtAuthGuard } from '@social-media-monorepo/shared-auth-utils';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService, JwtStrategy, JwtAuthGuard],
})
export class MediaModule {}
