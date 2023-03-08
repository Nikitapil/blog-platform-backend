import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserNameDto {
  @IsString({ message: 'Username must be string' })
  @MinLength(2, {
    message: 'Username is too short'
  })
  @ApiProperty({ example: 'Nikita', description: 'username' })
  userName: string;
}
