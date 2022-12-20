import {IsString} from "class-validator";

export class EditPostDto {
    readonly id

    @IsString({message: 'title must be string value'})
    readonly title: string;

    @IsString({message: 'content must be string value'})
    readonly content: string;

    @IsString({message: 'content must be string value'})
    readonly imageName: string;

    readonly userId: number;
}