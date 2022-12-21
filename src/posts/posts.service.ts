import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {CreatePostDto} from "./dto/create-post.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Post} from "./post.model";
import {FilesService} from "../files/files.service";
import {EditPostDto} from "./dto/edit-post-dto";
import {ReturnPostDto} from "./dto/return-post-dto";

@Injectable()
export class PostsService {

    constructor(@InjectModel(Post) private postRepository: typeof Post, private fileService: FilesService) {
    }

    async create(dto: CreatePostDto, image: any) {
        let fileName = ''
        if (image) {
            fileName = await this.fileService.createFile(image)
        }
        const post = await this.postRepository.create({...dto, image: fileName})
        return post;
    }

    async getPosts() {
        const posts = await this.postRepository.findAll({include: {all: true}})
        return posts.map(post => new ReturnPostDto(post))
    }

    async edit(dto: EditPostDto, image) {
        const post = await this.postRepository.findOne({where: {id: +dto.id}})
        if (!post) {
            throw new NotFoundException({message: 'Post not found'})
        }
        let fileName = ''
        if (image) {
            fileName = await this.fileService.updateFile(image, dto.imageName)
        }
        await post.update({title: dto.title, content: dto.content, image: fileName})
        return post;
    }

    async delete(id: number, userId) {
        const post = await this.postRepository.findOne({where: {id}})
        if (!post) {
            throw new NotFoundException({message: 'Post not found'})
        }
        if (post.userId !== userId) {
            throw new ForbiddenException({message: 'Forbidden'})
        }
        await this.postRepository.destroy({where: {id}})
        return null
    }

    async getSinglePost(id: number) {
        const post = await this.postRepository.findOne({where: {id}, include: {all: true}})
        if (!post) {
            throw new NotFoundException({message: 'Post not found'})
        }
        const response = new ReturnPostDto(post)
        return {...response}
    }
}
