import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Profile extends Document {
  @Prop({ required: true, unique: true })
  userId: string; // This matches the _id from auth-api

  @Prop({ required: true })
  username: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  bio: string;

  @Prop()
  profilePic: string; // URL string
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
