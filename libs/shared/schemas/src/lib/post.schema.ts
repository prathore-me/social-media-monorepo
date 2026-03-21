import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Comment {
  _id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: '' })
  caption: string;

  @Prop({ type: [String], default: [] })
  likes: string[];

  @Prop({ type: [Object], default: [] })
  comments: Comment[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
