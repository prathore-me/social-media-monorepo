import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from '@social-media-monorepo/shared-schemas';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
  ) {}

  async create(dto: CreateProfileDto): Promise<Profile> {
    const existing = await this.profileModel.findOne({
      $or: [{ userId: dto.userId }, { username: dto.username }],
    });
    if (existing) throw new ConflictException('Profile already exists');
    return this.profileModel.create(dto);
  }

  async getByUsername(username: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({
      username,
      deleted: { $ne: true },
    });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async getByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({
      userId,
      deleted: { $ne: true },
    });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async search(query: string): Promise<Profile[]> {
    return this.profileModel.find({
      username: { $regex: query, $options: 'i' },
      deleted: { $ne: true },
    }).limit(10);
  }

  async update(userId: string, dto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.profileModel.findOneAndUpdate(
      { userId, deleted: { $ne: true } },
      { $set: dto },
      { new: true },
    );
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async softDelete(userId: string): Promise<{ message: string }> {
    const profile = await this.profileModel.findOne({
      userId,
      deleted: { $ne: true },
    });
    if (!profile) throw new NotFoundException('Profile not found');

    await this.profileModel.findOneAndUpdate(
      { userId },
      { deleted: true, deletedAt: new Date() },
    );

    return { message: 'Profile scheduled for deletion in 30 days' };
  }

  async toggleFollow(targetUserId: string, currentUserId: string): Promise<{ following: boolean }> {
    const [targetProfile, currentProfile] = await Promise.all([
      this.profileModel.findOne({ userId: targetUserId, deleted: { $ne: true } }),
      this.profileModel.findOne({ userId: currentUserId, deleted: { $ne: true } }),
    ]);

    if (!targetProfile || !currentProfile) {
      throw new NotFoundException('Profile not found');
    }

    const isFollowing = targetProfile.followers.includes(currentUserId);

    if (isFollowing) {
      await Promise.all([
        this.profileModel.findOneAndUpdate(
          { userId: targetUserId },
          { $pull: { followers: currentUserId } },
        ),
        this.profileModel.findOneAndUpdate(
          { userId: currentUserId },
          { $pull: { following: targetUserId } },
        ),
      ]);
      return { following: false };
    } else {
      await Promise.all([
        this.profileModel.findOneAndUpdate(
          { userId: targetUserId },
          { $addToSet: { followers: currentUserId } },
        ),
        this.profileModel.findOneAndUpdate(
          { userId: currentUserId },
          { $addToSet: { following: targetUserId } },
        ),
      ]);
      return { following: true };
    }
  }
}
