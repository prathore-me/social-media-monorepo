import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, SignupDto } from '@social-media-monorepo/shared-dto';
import { User } from '@social-media-monorepo/shared-models';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  getData(): { message: string } {
    return { message: 'Hello from Auth API' };
  }

  async createUser(signupDto: SignupDto) {
    const existingUser = await this.userModel.findOne({
      $or: [{ email: signupDto.email }, { username: signupDto.username }],
    });
    if (existingUser) {
      throw new ConflictException('Email or username already in use');
    }
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const newUser = new this.userModel({
      email: signupDto.email,
      username: signupDto.username,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    const result = savedUser.toObject();
    delete result.password;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordValid = await bcrypt.compare(loginDto.password, user.password);

    if (user && passwordValid) {
      const payload = { email: user.email, sub: user._id };
      return {
        access_token: this.jwtService.sign(payload),
        user: { id: user._id, username: user.username, email: user.email },
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
