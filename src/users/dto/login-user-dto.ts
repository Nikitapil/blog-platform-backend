import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'test@test.tes', description: 'user email' })
  @IsString({ message: 'email must be string value' })
  @IsEmail({}, { message: 'Incorrect email' })
  readonly email: string;

  @IsString({ message: 'password must be string value' })
  @Length(4, 16, { message: 'Password length must be between 4 and 16' })
  @ApiProperty({ example: '12345', description: 'user password' })
  readonly password: string;
}
