import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript';
import { User } from '../users/users.model';
import { ApiProperty } from '@nestjs/swagger';
import { Like } from './like.model';
import { Comment } from './comment.model';
import { View } from './view.model';
import { HashtagPost } from './hashtag-post.model';
import { HashTag } from './hashtag.model';

interface PostCreationAttrs {
  title: string;
  content: string;
  userId: number;
  image: string;
}

@Table({ tableName: 'posts' })
export class Post extends Model<Post, PostCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Post id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
    onDelete: 'CASCADE'
  })
  id: number;

  @ApiProperty({ example: 'My first post', description: 'Post title' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: 'lorem ipsum...', description: 'Post content' })
  @Column({ type: DataType.STRING(1000000), allowNull: false })
  content: string;

  @ApiProperty({ example: '/123-123.jpg', description: 'Post cover link' })
  @Column({ type: DataType.STRING, allowNull: true })
  image: string;

  @ApiProperty({ example: '1', description: 'Post author id' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  author: User;

  @HasMany(() => Like)
  likes: Like[];

  @HasMany(() => Comment)
  comments: Comment[];

  @HasMany(() => View)
  views: View[];

  @BelongsToMany(() => HashTag, () => HashtagPost)
  hashtags: HashTag[];
}
