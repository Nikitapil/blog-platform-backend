import {ApiProperty} from "@nestjs/swagger";
import {Comment} from "../comment.model";

export class ReturnCommentDto {
    @ApiProperty({example: '1', description: 'Comment id'})
    id;

    @ApiProperty({example: 'Nice post!', description: 'Comment text'})
    text;

    @ApiProperty({example: '1', description: 'Comment author id'})
    userId;

    @ApiProperty({example: '1', description: 'Comment post id'})
    postId;

    @ApiProperty({example: '2023-01-04T12:32:38.220Z', description: 'Comment creation date'})
    createdAt;

    @ApiProperty({example: '2023-01-04T12:32:38.220Z', description: 'Comment editing date'})
    updatedAt;

    @ApiProperty({example: 'Nick', description: 'Comment author name'})
    author;

    @ApiProperty({example: '123.jpg', description: 'UserAvatar'})
    userAvatar;

    constructor(comment: Comment) {
        this.id = comment.id;
        this.text = comment.text;
        this.userId = comment.userId;
        this.postId = comment.postId;
        this.createdAt = comment.createdAt;
        this.updatedAt = comment.updatedAt;
        this.author = comment.author.userName;
        this.userAvatar = comment.author.avatar
    }
}