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

    @ApiOperation({summary: 'Delete post'})
    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    deletePost(@Param('id') id: string, @Req() req) {
        return this.postService.delete(+id, req.user.id)
    }

    @ApiOperation({summary: 'Get single post'})
    @ApiResponse({status: 200, type: ReturnPostDto})

    @Get('/:id')
    getSinglePost(@Param('id') id: string) {
        return this.postService.getSinglePost(+id)
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
    @UseGuards(JwtAuthGuard)
    getPostLikes(@Param('postId') postId: string) {
        return this.postService.getPostLikes(+postId)
    }
}
