import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {CreatePostDto} from "./dto/create-post.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Post} from "./post.model";
import {FilesService} from "../files/files.service";
import {EditPostDto} from "./dto/edit-post-dto";
import {ReturnPostDto} from "./dto/return-post-dto";
import {Op} from "sequelize";
import {AddLikeDto} from "./dto/add-like.dto";
import {Like} from "./like.model";

@Injectable()
export class PostsService {

    constructor(
        @InjectModel(Post) private postRepository: typeof Post,
        @InjectModel(Like) private likeRepository: typeof Like,
        private fileService: FilesService,
    ) {}

    async create(dto: CreatePostDto, image: any) {
        let fileName = ''
        if (image) {
            fileName = await this.fileService.createFile(image)
        }
        const post = await this.postRepository.create({...dto, image: fileName})
        return post;
    }

    async getPosts(page = 1, limit = 10, search) {
        const offset = page * limit - limit
        const posts = await this.postRepository.findAndCountAll({include: {all: true}, limit, offset, where: {
         title: {[Op.iLike]: `%${search}%`}
            }, order: [['updatedAt', 'DESC']]})
        return {
            count: posts.count,
            posts: posts.rows.map(post => new ReturnPostDto(post))
        }
    }

    async edit(dto: EditPostDto, image) {
        const post = await this.postRepository.findOne({where: {id: +dto.id}})
        if (!post) {
            throw new NotFoundException({message: 'Post not found'})
        }
        if (post.userId !== +dto.userId) {
            throw new ForbiddenException({message: 'UserId is not equal'})
        }
        if (post.image && !image) {
            await this.fileService.deleteFile(post.image)
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
        await this.fileService.deleteFile(post.image)
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

    async addLike(dto: AddLikeDto) {
        const candidate = await this.likeRepository.findOne({where: {userId: dto.userId, postId: dto.postId}})
        if (candidate) {
            throw new ForbiddenException({message: 'Like already exists'})
        }
        await this.likeRepository.create({...dto})
        const likes = await this.likeRepository.findAndCountAll({where: {postId: dto.postId}})
        return likes
    }

    async deleteLike(dto: AddLikeDto) {
        const like = await this.likeRepository.findOne({where: {userId: dto.userId, postId: dto.postId}})
        if (!like) {
            throw new NotFoundException({message: 'Like not found'})
        }
        await like.destroy()
        const likes = await this.likeRepository.findAndCountAll({where: {postId: dto.postId}})
        return likes
    }

    async getPostLikes(postId: number) {
        const likes = await this.likeRepository.findAndCountAll({where: {postId}})
        if (!likes) {
            throw new NotFoundException({message: 'Likes not found'})
        }
        return likes
    }
}
