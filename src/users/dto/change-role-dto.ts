import { IsArray, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeRoleDto {
  @ApiProperty({ example: 'ADMIN', description: 'new user role' })
  @IsArray({ message: 'Value must be string' })
  readonly values: string[];

  @ApiProperty({ example: '1', description: 'user id' })
  @IsNumber({}, { message: 'userId must be number' })
  readonly userId: number;
}
