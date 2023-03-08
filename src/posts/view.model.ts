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

interface ViewCreationAttrs {
  userId: number;
  postId: number;
}

@Table({ tableName: 'views' })
export class View extends Model<View, ViewCreationAttrs> {
  @ApiProperty({ example: '1', description: 'View id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ApiProperty({ example: '1', description: 'User id' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: string;

  @ApiProperty({ example: '1', description: 'Post id' })
  @ForeignKey(() => Post)
  @Column({ type: DataType.INTEGER })
  postId: string;

  @BelongsTo(() => User)
  author: User;

  @BelongsTo(() => Post)
  post: Post;
}
