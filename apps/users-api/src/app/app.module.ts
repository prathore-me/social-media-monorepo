import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env['MONGO_URI']),
    ProfilesModule,
  ],
})
export class AppModule {}
