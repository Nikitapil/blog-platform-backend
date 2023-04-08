import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'My first post', description: 'Post title' })
  @IsString({ message: 'title must be string value' })
  readonly title: string;

  @ApiProperty({ example: 'lorem ipsum...', description: 'Post content' })
  @IsString({ message: 'content must be string value' })
  readonly content: string;

  @ApiProperty({ example: '["hello", "soft"]', description: 'Hashtags array' })
  readonly hashtags: string[];
}
