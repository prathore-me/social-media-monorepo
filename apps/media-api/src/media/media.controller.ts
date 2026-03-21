import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MediaService, BucketName } from './media.service';
import { JwtAuthGuard } from '@social-media-monorepo/shared-auth-utils';

const ALLOWED_BUCKETS: BucketName[] = ['posts-images', 'profile-pictures', 'videos'];

const ALLOWED_MIME_TYPES: Record<BucketName, string[]> = {
  'posts-images': ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  'profile-pictures': ['image/jpeg', 'image/png', 'image/webp'],
  'videos': ['video/mp4', 'video/webm', 'video/quicktime'],
};

const MAX_FILE_SIZE: Record<BucketName, number> = {
  'posts-images': 10 * 1024 * 1024,    // 10MB
  'profile-pictures': 5 * 1024 * 1024,  // 5MB
  'videos': 100 * 1024 * 1024,          // 100MB
};

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload/:bucket')
  @UseInterceptors(
    FileInterceptor('file', { storage: memoryStorage() }),
  )
  async upload(
    @Param('bucket') bucket: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!ALLOWED_BUCKETS.includes(bucket as BucketName)) {
      throw new BadRequestException(`Invalid bucket. Allowed: ${ALLOWED_BUCKETS.join(', ')}`);
    }

    const typedBucket = bucket as BucketName;

    if (!file) throw new BadRequestException('No file provided');

    if (!ALLOWED_MIME_TYPES[typedBucket].includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type for ${bucket}. Allowed: ${ALLOWED_MIME_TYPES[typedBucket].join(', ')}`,
      );
    }

    if (file.size > MAX_FILE_SIZE[typedBucket]) {
      throw new BadRequestException(
        `File too large. Max size for ${bucket}: ${MAX_FILE_SIZE[typedBucket] / 1024 / 1024}MB`,
      );
    }

    return this.mediaService.uploadFile(typedBucket, file);
  }
}
