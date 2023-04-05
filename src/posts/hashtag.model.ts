import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from './post.model';
import { HashtagPost } from './hashtag-post.model';

interface HashTagCreatingAttrs {
  value: string;
}

@Table({ tableName: 'hashtags' })
export class HashTag extends Model<HashTag, HashTagCreatingAttrs> {
  @ApiProperty({ example: '1', description: 'unique id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ApiProperty({ example: 'Software', description: 'hashtag value' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value: string;

  @BelongsToMany(() => Post, () => HashtagPost)
  posts: Post[];
}
