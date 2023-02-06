import {
    Body,
    Controller, Delete,
    ForbiddenException,
    Get, Param,
    Post, Put, Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {CreatePostDto} from "./dto/create-post.dto";
import {PostsService} from "./posts.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {JwtAuthGuard} from "../auth/jwt.auth.guard";
import {EditPostDto} from "./dto/edit-post-dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Post as PostModel} from "./post.model";
import {ReturnPostDto} from "./dto/return-post-dto";
import {AddLikeDto} from "./dto/add-like.dto";
import {Like} from "./like.model";
import {AddCommentDto} from "./dto/add-comment.dto";
import {Comment} from "./comment.model";
import {EditCommentDto} from "./dto/edit-comment.dto";
import {User} from "../decorators/User.decorator";
import {TUserTokenPayload} from "../types/common";
import {ReturnCommentDto} from "./dto/return-comment.dto";

@ApiTags('Posts')
@Controller('posts')
export class PostsController {

    constructor(private postService: PostsService) {
    }

    @ApiOperation({summary: 'Creating post'})
    @ApiResponse({status: 200, type: PostModel})
    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    createPost(@Body() dto: CreatePostDto, @UploadedFile() image, @Req() req) {
        if (req.user.id !== +dto.userId) {
            throw new ForbiddenException({message: 'UserId is not equal'})
        }
        return this.postService.create(dto, image)
    }

    @ApiOperation({summary: 'Edit post'})
    @ApiResponse({status: 200, type: PostModel})
    @Put()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    editPost(@Body() dto: EditPostDto, @UploadedFile() image, @Req() req) {
        if (req.user.id !== +dto.userId) {
            throw new ForbiddenException({message: 'UserId is not equal'})
        }
        return this.postService.edit(dto, image)
    }

    @ApiOperation({summary: 'Get all posts'})
    @ApiResponse({status: 200, type: [ReturnPostDto]})
    @Get()
    getPosts(@Query() query) {
        const page = +query.page || 1
        const limit = query.limit || 10
        const search = query.search || ''
        return this.postService.getPosts(page, limit, search)
    }

    @ApiOperation({summary: 'Get all posts by user'})
    @ApiResponse({status: 200, type: [ReturnPostDto]})
    @Get('/user/:id')
    getPostsByUser(@Param('id') id: string) {
        return this.postService.getPostsByUser(+id)
    }

    @ApiOperation({summary: 'Get all posts by user likes'})
    @ApiResponse({status: 200, type: [ReturnPostDto]})
    @Get('/user/likes/:id')
    getPostsByUserLikes(@Param('id') id: string) {
        return this.postService.getPostsByUserLikes(+id)
    }

    @ApiOperation({summary: 'Delete post'})
    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    deletePost(@Param('id') id: string, @Req() req) {
        return this.postService.delete(+id, req.user.id)
    }

    @ApiOperation({summary: 'Get single post'})
    @ApiResponse({status: 200, type: ReturnPostDto})

    @Get('/:id')
    getSinglePost(@Param('id') id: string, @User() user: TUserTokenPayload | null) {
        console.log(user)
        return this.postService.getSinglePost(+id, user)
    }

    @ApiOperation({summary: 'Add like'})
    @ApiResponse({status: 200, type: [Like]})
    @Post('/like')
    @UseGuards(JwtAuthGuard)
    addLike(@Body() dto: AddLikeDto, @Req() req) {
        if (req.user.id !== +dto.userId) {
            throw new ForbiddenException({message: 'UserId is not equal'})
        }
        return this.postService.addLike(dto)
    }

    @ApiOperation({summary: 'Delete like'})
    @ApiResponse({status: 200, type: [Like]})
    @Delete('/like/:postId')
    @UseGuards(JwtAuthGuard)
    deleteLike(@Param('postId') postId: string, @Req() req) {
        return this.postService.deleteLike({postId: +postId, userId: req.user.id})
    }

    @ApiOperation({summary: 'Get post likes'})
    @ApiResponse({status: 200, type: [Like]})
    @Get('/like/:postId')
    getPostLikes(@Param('postId') postId: string) {
        return this.postService.getPostLikes(+postId)
    }

    @ApiOperation({summary: 'Create new comment to post'})
    @ApiResponse({status: 200, type: [Comment]})
    @Post('/comment')
    @UseGuards(JwtAuthGuard)
    addComment(@Body() dto: AddCommentDto, @Req() req) {
        if (req.user.id !== +dto.userId) {
            throw new ForbiddenException({message: 'UserId is not equal'})
        }
        return this.postService.addComment(dto)
    }

    @ApiOperation({summary: 'get post comments'})
    @ApiResponse({status: 200, type: [ReturnCommentDto]})
    @Get('/comment/:postId')
    getPostComments(@Param('postId') postId: string) {
        return this.postService.getPostComments(+postId)
    }

    @ApiOperation({summary: 'get post comments by user'})
    @ApiResponse({status: 200, type: [ReturnCommentDto]})
    @Get('/comment/user/:userId')
    getPostCommentsByUser(@Param('userId') userId: string) {
        return this.postService.getCommentsByUserId(+userId)
    }

    @ApiOperation({summary: 'edit post comment'})
    @ApiResponse({status: 200, type: [Comment]})
    @Put('/comment')
    @UseGuards(JwtAuthGuard)
    editComment(@Body() dto: EditCommentDto, @Req() req) {
        return this.postService.editComment(dto, req.user.id)
    }

    @ApiOperation({summary: 'edit post comment'})
    @ApiResponse({status: 200, type: [Comment]})
    @Delete('/comment/:commentId')
    @UseGuards(JwtAuthGuard)
    deleteComment(@Param('commentId') commentId: string, @Req() req) {
        return this.postService.deleteComment(+commentId, req.user.id)
    }
}
