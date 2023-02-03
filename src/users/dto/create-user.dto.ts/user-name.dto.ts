import {IsString, MinLength} from "class-validator";

export class UserNameDto {
    @IsString({message: 'Username must be string'})
    @MinLength(2, {
        message: 'Username is too short',
    })
    userName: string
}