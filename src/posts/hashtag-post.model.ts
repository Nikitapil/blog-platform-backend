import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { Post } from './post.model';
import { HashTag } from './hashtag.model';

@Table({ tableName: 'hashtag-posts', createdAt: false, updatedAt: false })
export class HashtagPost extends Model<HashtagPost> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ForeignKey(() => Post)
  @Column({ type: DataType.INTEGER, onDelete: 'CASCADE' })
  postId: number;

  @ForeignKey(() => HashTag)
  @Column({ type: DataType.INTEGER, onDelete: 'CASCADE' })
  hashTagId: string;
}
