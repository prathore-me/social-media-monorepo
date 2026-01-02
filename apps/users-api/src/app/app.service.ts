import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from '@social-media-monorepo/shared-models';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Profile.name)
    private profileModel: Model<Profile>,
  ) {}

  getData(): { message: string } {
    return { message: 'Hello from Users API' };
  }

  async createProfile(data: Partial<Profile>) {
    return this.profileModel.create(data);
  }

  async getProfile(username: string) {
    return this.profileModel.findOne({ username });
  }

  async updateProfile(userId: string, data: Partial<Profile>) {
    return this.profileModel.findOneAndUpdate({ userId }, data, { new: true });
  }
}
