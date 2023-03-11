import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UnbanUserDto {
  @ApiProperty({ example: '1', description: 'user id' })
  @IsNumber({}, { message: 'userId must be number' })
  readonly userId: number;
}
