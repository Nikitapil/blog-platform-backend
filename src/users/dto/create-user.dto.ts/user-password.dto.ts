import { Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserPasswordDto {
  @Length(4, 16, { message: 'Password length must be between 4 and 16' })
  @ApiProperty({ example: '12345', description: 'user password(new)' })
  readonly newPassword: string;

  @ApiProperty({ example: '12345', description: 'user password(old)' })
  readonly oldPassword: string;
}
