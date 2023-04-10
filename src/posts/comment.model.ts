import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { User } from '../users/users.model';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from './post.model';

interface CommentCreationAttrs {
  userId: number;
  postId: number;
  comment: string;
}

@Table({ tableName: 'comments' })
export class Comment extends Model<Comment, CommentCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Comment id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ApiProperty({
    example: 'Nice post!',
    description: 'comment text',
    required: true
  })
  @Column({ type: DataType.STRING(1000000) })
  text: string;

  @ApiProperty({ example: '1', description: 'User id' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ApiProperty({ example: '1', description: 'Post id' })
  @ForeignKey(() => Post)
  @Column({ type: DataType.INTEGER, onDelete: 'CASCADE' })
  postId: string;

  @BelongsTo(() => User)
  author: User;

  @BelongsTo(() => Post)
  post: Post;
}
