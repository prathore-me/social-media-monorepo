import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env['MONGO_URI']),
    AuthModule,
  ],
})
export class AppModule {}
