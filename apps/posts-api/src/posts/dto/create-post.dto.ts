import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsUrl({ require_tld: false }) // require_tld: false allows localhost URLs
  @IsNotEmpty()
  imageUrl: string;

  @IsOptional()
  @IsString()
  caption?: string;
}
