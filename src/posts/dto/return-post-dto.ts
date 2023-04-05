import { Post } from '../post.model';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnPostDto {
  @ApiProperty({ example: '1', description: 'Post id' })
  id;
  @ApiProperty({ example: 'My first post', description: 'Post title' })
  title;
  @ApiProperty({ example: 'Lorem ipsum...', description: 'Post content' })
  content;
  @ApiProperty({ example: '123-123.jpg', description: 'Post cover link' })
  image;
  @ApiProperty({ example: '1', description: 'Post author id' })
  userId;
  @ApiProperty({
    example: '2023-01-04T12:32:38.220Z',
    description: 'Post creation date'
  })
  createdAt;
  @ApiProperty({
    example: '2023-01-04T12:32:38.220Z',
    description: 'Post editing date'
  })
  updatedAt;
  @ApiProperty({ example: 'Nick', description: 'Post author name' })
  author;
  @ApiProperty({ example: 10, description: 'Post likes count' })
  likesCount;
  @ApiProperty({ example: 10, description: 'Post comments count' })
  commentsCount;
  @ApiProperty({ example: 10, description: 'Post views count' })
  viewsCount;
  @ApiProperty({ example: '123.jpg', description: 'UserAvatar' })
  userAvatar;
  @ApiProperty({ example: '["hello", "soft"]', description: 'post hashtags' })
  hashtags;

  constructor(post: Post) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.image = post.image;
    this.userId = post.userId;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
    this.author = post.author.userName;
    this.likesCount = post.likes.length;
    this.commentsCount = post.comments.length;
    this.viewsCount = post.views.length;
    this.userAvatar = post.author.avatar || '';
    this.hashtags = post.hashtags.map((hashtag) => hashtag.value);
  }
}
