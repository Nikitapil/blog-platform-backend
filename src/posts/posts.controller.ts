import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { EditPostDto } from './dto/edit-post-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Post as PostModel } from './post.model';
import { ReturnPostDto } from './dto/return-post-dto';
import { AddLikeDto } from './dto/add-like.dto';
import { Like } from './like.model';
import { AddCommentDto } from './dto/add-comment.dto';
import { Comment } from './comment.model';
import { EditCommentDto } from './dto/edit-comment.dto';
import { User } from '../decorators/User.decorator';
import { TUserTokenPayload } from '../types/common';
import { ReturnCommentDto } from './dto/return-comment.dto';
import { ReqUser } from '../decorators/req-user.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @ApiOperation({ summary: 'Creating post' })
  @ApiResponse({ status: 200, type: PostModel })
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  createPost(
    @Body() dto: CreatePostDto,
    @UploadedFile() image: Express.Multer.File,
    @ReqUser('id') userId: number
  ): Promise<PostModel> {
    return this.postService.create(dto, userId, image);
  }

  @ApiOperation({ summary: 'Edit post' })
  @ApiResponse({ status: 200, type: PostModel })
  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  editPost(
    @Body() dto: EditPostDto,
    @UploadedFile() image: Express.Multer.File,
    @ReqUser('id') userId: number
  ): Promise<PostModel> {
    return this.postService.edit(dto, image, userId);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, type: [ReturnPostDto] })
  @Get()
  getPosts(@Query() query) {
    const { page = 1, limit = 10, search = '', tag = '' } = query;
    return this.postService.getPosts(+page, +limit, search, tag);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, type: [ReturnPostDto] })
  @Get('/posts_by_like')
  getPostsByLikes(@Query() query) {
    const page = +query.page || 1;
    const limit = query.limit || 5;
    return this.postService.getPostsWithLikes(page, limit);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, type: [ReturnPostDto] })
  @Get('/posts_by_views')
  getPostsByViews(@Query() query) {
    const page = +query.page || 1;
    const limit = query.limit || 5;
    return this.postService.getPostsWithViews(page, limit);
  }

  @ApiOperation({ summary: 'Get all posts by user' })
  @ApiResponse({ status: 200, type: [ReturnPostDto] })
  @Get('/user/:id')
  getPostsByUser(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostsByUser(id);
  }

  @ApiOperation({ summary: 'Get all posts by user likes' })
  @ApiResponse({ status: 200, type: [ReturnPostDto] })
  @Get('/user/likes/:id')
  getPostsByUserLikes(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostsByUserLikes(id);
  }

  @ApiOperation({ summary: 'Delete post' })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deletePost(
    @Param('id', ParseIntPipe) id: number,
    @ReqUser() user: TUserTokenPayload
  ) {
    return this.postService.delete(id, user);
  }

  @ApiOperation({ summary: 'Get single post' })
  @ApiResponse({ status: 200, type: ReturnPostDto })
  @Get('/:id')
  getSinglePost(
    @Param('id', ParseIntPipe) id: number,
    @User() user: TUserTokenPayload | null
  ) {
    return this.postService.getSinglePost(id, user);
  }

  @ApiOperation({ summary: 'Add like' })
  @ApiResponse({ status: 200, type: [Like] })
  @Post('/like')
  @UseGuards(JwtAuthGuard)
  addLike(@Body() dto: AddLikeDto, @ReqUser('id') userId: number) {
    return this.postService.addLike(dto, userId);
  }

  @ApiOperation({ summary: 'Delete like' })
  @ApiResponse({ status: 200, type: [Like] })
  @Delete('/like/:postId')
  @UseGuards(JwtAuthGuard)
  deleteLike(
    @Param('postId', ParseIntPipe) postId: number,
    @ReqUser('id') userId: number
  ) {
    return this.postService.deleteLike(postId, userId);
  }

  @ApiOperation({ summary: 'Get post likes' })
  @ApiResponse({ status: 200, type: [Like] })
  @Get('/like/:postId')
  getPostLikes(@Param('postId', ParseIntPipe) postId: number) {
    return this.postService.getPostLikes(postId);
  }

  @ApiOperation({ summary: 'Create new comment to post' })
  @ApiResponse({ status: 200, type: [Comment] })
  @Post('/comment')
  @UseGuards(JwtAuthGuard)
  addComment(@Body() dto: AddCommentDto, @ReqUser('id') userId: number) {
    return this.postService.addComment(dto, userId);
  }

  @ApiOperation({ summary: 'get post comments' })
  @ApiResponse({ status: 200, type: [ReturnCommentDto] })
  @Get('/comment/:postId')
  getPostComments(@Param('postId', ParseIntPipe) postId: number) {
    return this.postService.getPostComments(postId);
  }

  @ApiOperation({ summary: 'get post comments by user' })
  @ApiResponse({ status: 200, type: [ReturnCommentDto] })
  @Get('/comment/user/:userId')
  getPostCommentsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.postService.getCommentsByUserId(userId);
  }

  @ApiOperation({ summary: 'edit post comment' })
  @ApiResponse({ status: 200, type: [Comment] })
  @Put('/comment')
  @UseGuards(JwtAuthGuard)
  editComment(@Body() dto: EditCommentDto, @ReqUser('id') userId: number) {
    return this.postService.editComment(dto, userId);
  }

  @ApiOperation({ summary: 'edit post comment' })
  @ApiResponse({ status: 200, type: [Comment] })
  @Delete('/comment/:commentId')
  @UseGuards(JwtAuthGuard)
  deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @ReqUser() user: TUserTokenPayload
  ) {
    return this.postService.deleteComment(commentId, user);
  }
}
