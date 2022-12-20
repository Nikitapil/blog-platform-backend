import {
    Body,
    Controller, Delete,
    ForbiddenException,
    Get, Param,
    Post, Put,
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

@Controller('posts')
export class PostsController {

    constructor(private postService: PostsService) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    createPost(@Body() dto: CreatePostDto, @UploadedFile() image, @Req() req) {
        if (req.user.id !== +dto.userId) {
            throw new ForbiddenException({message: 'UserId is not equal'})
        }
        return this.postService.create(dto, image)
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    editPost(@Body() dto: EditPostDto, @UploadedFile() image, @Req() req) {
        if (req.user.id !== +dto.userId) {
            throw new ForbiddenException({message: 'UserId is not equal'})
        }
        return this.postService.edit(dto, image)
    }

    @Get()
    getPosts() {
        return this.postService.getPosts()
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    deletePost(@Param('id') id: string, @Req() req) {
        return this.postService.delete(+id, req.user.id)
    }
}
