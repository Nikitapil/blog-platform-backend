import {IsString} from "class-validator";

export class CreatePostDto {
    @IsString({message: 'title must be string value'})
    readonly title: string;

    @IsString({message: 'content must be string value'})
    readonly content: string;

    readonly userId: number;
}