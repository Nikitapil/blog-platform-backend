import {IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class AddRoleDto {
    @ApiProperty({example: 'ADMIN', description: 'new user role'})
    @IsString({message: "Value must be string"})
    readonly value: string;

    @ApiProperty({example: '1', description: 'user id'})
    @IsNumber({}, {message: "userId must be number"})
    readonly userId: number;
}