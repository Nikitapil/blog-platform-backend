import { ApiProperty } from '@nestjs/swagger';

export class AddLikeDto {
  @ApiProperty({ example: '1', description: 'Like author id' })
  readonly userId: number;

  @ApiProperty({ example: '1', description: 'Like post id' })
  readonly postId: number;
}
