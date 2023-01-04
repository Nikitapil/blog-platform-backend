import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";
import {ApiProperty} from "@nestjs/swagger";

interface PostCreationAttrs {
    title: string;
    content: string;
    userId: number;
    image: string
}

@Table({tableName: 'posts'})
export class Post extends Model<Post, PostCreationAttrs> {
    @ApiProperty({example: '1', description: 'Post id'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'My first post', description: 'Post title'})
    @Column({type: DataType.STRING, allowNull: false})
    title: string;

    @ApiProperty({example: 'lorem ipsum...', description: 'Post content'})
    @Column({type: DataType.STRING(1000000), allowNull: false})
    content: string;

    @ApiProperty({example: '/123-123.jpg', description: 'Post cover link'})
    @Column({type: DataType.STRING, allowNull: true})
    image: string;

    @ApiProperty({example: '1', description: 'Post author id'})
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @BelongsTo(() => User)
    author: User
}