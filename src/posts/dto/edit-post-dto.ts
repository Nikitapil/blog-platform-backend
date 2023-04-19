import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditPostDto {
  readonly id;

  @ApiProperty({ example: 'My edited post', description: 'Post title' })
  @IsString({ message: 'title must be string value' })
  readonly title: string;

  @ApiProperty({
    example: 'My edited post content',
    description: 'Post content'
  })
  @IsString({ message: 'content must be string value' })
  readonly content: string;

  @ApiProperty({ example: '123-123.jpg', description: 'Name of post image' })
  @IsString({ message: 'content must be string value' })
  readonly imageName: string;

  @ApiProperty({ example: '["hello", "soft"]', description: 'Hashtags array' })
  readonly hashtags: string[];
}
