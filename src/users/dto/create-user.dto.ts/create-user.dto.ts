import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({example: 'test@test.tes', description: 'user email'})
    readonly email: string;
    @ApiProperty({example: '12345', description: 'user password'})
    readonly password: string;
}