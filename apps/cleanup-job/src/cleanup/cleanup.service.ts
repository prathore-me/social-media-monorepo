import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '@social-media-monorepo/shared-schemas';
import { User } from '@social-media-monorepo/shared-schemas';
import { Profile } from '@social-media-monorepo/shared-schemas';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);
  private readonly RETENTION_DAYS = 30;

  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
  ) {}

  private getExpiryDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() - this.RETENTION_DAYS);
    return date;
  }

  async cleanupPosts(): Promise<void> {
    const expiryDate = this.getExpiryDate();
    const result = await this.postModel.deleteMany({
      deleted: true,
      deletedAt: { $lte: expiryDate },
    });
    this.logger.log(`Permanently deleted ${result.deletedCount} posts older than ${this.RETENTION_DAYS} days`);
  }

  async cleanupUsers(): Promise<void> {
    const expiryDate = this.getExpiryDate();

    const deletedUsers = await this.userModel.find({
      deleted: true,
      deletedAt: { $lte: expiryDate },
    });

    if (deletedUsers.length === 0) {
      this.logger.log('No users to permanently delete');
      return;
    }

    const userIds = deletedUsers.map((u) => u._id.toString());

    // Delete profiles
    const profileResult = await this.profileModel.deleteMany({
      userId: { $in: userIds },
    });

    // Delete users
    const userResult = await this.userModel.deleteMany({
      _id: { $in: userIds },
    });

    this.logger.log(
      `Permanently deleted ${userResult.deletedCount} users and ${profileResult.deletedCount} profiles older than ${this.RETENTION_DAYS} days`,
    );
  }

  async runAll(): Promise<void> {
    this.logger.log('Starting cleanup job...');
    await this.cleanupPosts();
    await this.cleanupUsers();
    this.logger.log('Cleanup job completed.');
  }
}
