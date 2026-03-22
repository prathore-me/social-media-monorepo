import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CleanupModule } from '../cleanup/cleanup.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env['MONGO_URI']),
    CleanupModule,
  ],
})
export class AppModule {}
