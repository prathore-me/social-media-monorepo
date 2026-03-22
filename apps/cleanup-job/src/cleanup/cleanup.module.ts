import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CleanupService } from './cleanup.service';
import {
  Post, PostSchema,
  User, UserSchema,
  Profile, ProfileSchema,
} from '@social-media-monorepo/shared-schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  providers: [CleanupService],
  exports: [CleanupService],
})
export class CleanupModule {}
