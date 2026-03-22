import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { User } from '@social-media-monorepo/shared-schemas';
import { SignupDto, LoginDto } from '@social-media-monorepo/shared-dto';

@Injectable()
export class AuthService {
  private readonly usersApiUrl = process.env['USERS_API_URL'];

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const existing = await this.userModel.findOne({
      $or: [{ email: signupDto.email }, { username: signupDto.username }],
      deleted: { $ne: true },
    });
    if (existing) {
      throw new ConflictException('Email or username already in use');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const user = await this.userModel.create({
      email: signupDto.email,
      username: signupDto.username,
      password: hashedPassword,
    });

    // TODO: replace with event-driven approach (Redis) later
    await axios.post(`${this.usersApiUrl}/profiles`, {
      userId: user._id.toString(),
      username: user.username,
    });

    return { message: 'Account created successfully' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({
      email: loginDto.email,
      deleted: { $ne: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id.toString(),
      username: user.username,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    };
  }

  async deleteAccount(userId: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({
      _id: userId,
      deleted: { $ne: true },
    });

    if (!user) throw new NotFoundException('User not found');

    // Soft delete user
    await this.userModel.findByIdAndUpdate(userId, {
      deleted: true,
      deletedAt: new Date(),
    });

    // Soft delete profile via users-api
    await axios.delete(`${this.usersApiUrl}/profiles/${userId}`);

    return { message: 'Account scheduled for deletion in 30 days' };
  }
}
