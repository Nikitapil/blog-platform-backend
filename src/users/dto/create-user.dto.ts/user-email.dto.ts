import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString} from "class-validator";

export class UserEmailDto {
    @ApiProperty({example: 'test@test.tes', description: 'user email'})
    @IsString({message: 'email must be string value'})
    @IsEmail({}, {message: 'Incorrect email'})
    readonly email: string;
}