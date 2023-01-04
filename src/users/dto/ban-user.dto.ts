import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class BanUserDto {
    @ApiProperty({example: '1', description: 'user id'})
    @IsNumber({}, {message: "userId must be number"})
    readonly userId: number;

    @ApiProperty({example: 'bad user', description: 'ban reason'})
    @IsString({message: "Value must be string"})
    readonly banReason: string;
}