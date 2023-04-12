import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddCommentDto {
  @ApiProperty({ example: '1', description: 'Comment post id' })
  readonly postId: number;

  @ApiProperty({ example: 'Nice post!', description: 'comment text' })
  @IsString({ message: 'Comment must be string value' })
  readonly text: string;
}
