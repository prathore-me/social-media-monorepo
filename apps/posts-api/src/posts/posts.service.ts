import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '@social-media-monorepo/shared-schemas';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async create(dto: CreatePostDto, userId: string, username: string): Promise<Post> {
    return this.postModel.create({
      ...dto,
      userId,
      username,
    });
  }

  async getFeed(): Promise<Post[]> {
    return this.postModel.find().sort({ createdAt: -1 });
  }

  async getByUserId(userId: string): Promise<Post[]> {
    return this.postModel.find({ userId }).sort({ createdAt: -1 });
  }

  async update(postId: string, dto: UpdatePostDto, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new UnauthorizedException('You can only edit your own posts');
    return this.postModel.findByIdAndUpdate(postId, { $set: dto }, { new: true });
  }

  async delete(postId: string, userId: string): Promise<{ message: string }> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new UnauthorizedException('You can only delete your own posts');
    await this.postModel.findByIdAndDelete(postId);
    return { message: 'Post deleted successfully' };
  }

  async toggleLike(postId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const isLiked = post.likes.includes(userId);

    const updated = await this.postModel.findByIdAndUpdate(
      postId,
      isLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
      { new: true },
    );

    return { liked: !isLiked, likesCount: updated.likes.length };
  }

  async addComment(postId: string, dto: CreateCommentDto, userId: string, username: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const comment = {
      _id: new (require('mongoose').Types.ObjectId)(),
      userId,
      username,
      text: dto.text,
      createdAt: new Date(),
    };

    return this.postModel.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true },
    );
  }

  async deleteComment(postId: string, commentId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const comment = post.comments.find((c) => c._id.toString() === commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new UnauthorizedException('You can only delete your own comments');

    return this.postModel.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: new (require('mongoose').Types.ObjectId)(commentId) } } },
      { new: true },
    );
  }
}
