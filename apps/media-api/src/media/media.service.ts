import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import * as Minio from 'minio';

export type BucketName = 'posts-images' | 'profile-pictures' | 'videos';

@Injectable()
export class MediaService implements OnModuleInit {
  private client: Minio.Client;

  private readonly buckets: BucketName[] = [
    'posts-images',
    'profile-pictures',
    'videos',
  ];

  constructor() {
    this.client = new Minio.Client({
      endPoint: process.env['MINIO_ENDPOINT'] || 'localhost',
      port: parseInt(process.env['MINIO_PORT'] || '9000'),
      useSSL: process.env['MINIO_USE_SSL'] === 'true',
      accessKey: process.env['MINIO_ROOT_USER'] || 'minioadmin',
      secretKey: process.env['MINIO_ROOT_PASSWORD'] || 'minioadmin123',
    });
  }

  async onModuleInit() {
    for (const bucket of this.buckets) {
      const exists = await this.client.bucketExists(bucket);
      if (!exists) {
        await this.client.makeBucket(bucket);
        await this.client.setBucketPolicy(
          bucket,
          JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: { AWS: ['*'] },
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${bucket}/*`],
              },
            ],
          }),
        );
      }
    }
  }

  async uploadFile(
    bucket: BucketName,
    file: Express.Multer.File,
  ): Promise<{ url: string }> {
    if (!file) throw new BadRequestException('No file provided');

    const ext = file.originalname.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    await this.client.putObject(
      bucket,
      filename,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
    );

    const endpoint = process.env['MINIO_ENDPOINT'] || 'localhost';
    const port = process.env['MINIO_PORT'] || '9000';
    const useSSL = process.env['MINIO_USE_SSL'] === 'true';
    const protocol = useSSL ? 'https' : 'http';

    // In dev, use localhost. In prod, use the endpoint directly
    const host = endpoint === 'minio' ? 'localhost' : endpoint;
    const url = `${protocol}://${host}:${port}/${bucket}/${filename}`;

    return { url };
  }
}
