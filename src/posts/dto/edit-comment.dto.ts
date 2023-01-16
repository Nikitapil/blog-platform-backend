import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class EditCommentDto {
    readonly id;

    @ApiProperty({example: 'My edited comment', description: 'Comment text'})
    @IsString({message: 'Comment must be string value'})
    readonly text: string
}