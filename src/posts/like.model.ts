import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";
import {ApiProperty} from "@nestjs/swagger";
import {Post} from "./post.model";

interface LikeCreationAttrs {
    userId: number;
    postId: number;
}

@Table({tableName: 'likes'})
export class Like extends Model<Like, LikeCreationAttrs> {
    @ApiProperty({example: '1', description: 'Like id'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '1', description: 'User id'})
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: string;

    @ApiProperty({example: '1', description: 'Post id'})
    @ForeignKey(() => Post)
    @Column({type: DataType.INTEGER})
    postId: string;

    @BelongsTo(() => User)
    author: User

    @BelongsTo(() => Post)
    post: Post
}