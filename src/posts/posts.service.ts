import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './post.model';
import { FilesService } from '../files/files.service';
import { EditPostDto } from './dto/edit-post-dto';
import { ReturnPostDto } from './dto/return-post-dto';
import sequelize, { Op } from 'sequelize';
import { AddLikeDto } from './dto/add-like.dto';
import { Like } from './like.model';
import { AddCommentDto } from './dto/add-comment.dto';
import { Comment } from './comment.model';
import { ReturnCommentDto } from './dto/return-comment.dto';
import { EditCommentDto } from './dto/edit-comment.dto';
import { TUserTokenPayload } from '../types/common';
import { View } from './view.model';
import { EUserRoles } from '../helpers/constants';
import { HashTag } from './hashtag.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    @InjectModel(Like) private likeRepository: typeof Like,
    @InjectModel(Comment) private commentRepository: typeof Comment,
    @InjectModel(View) private viewRepository: typeof View,
    @InjectModel(HashTag) private hashTagRepository: typeof HashTag,
    private fileService: FilesService
  ) {}

  async create(dto: CreatePostDto, image: any) {
    let fileName = '';
    if (image) {
      fileName = await this.fileService.createFile(image);
    }
    const post = await this.postRepository.create({ ...dto, image: fileName });
    if (dto.hashtags) {
      const hashtags = await this.createHashTags(dto.hashtags);
      await post.$set('hashtags', hashtags);
    }

    return post;
  }

  async getPosts(page = 1, limit = 10, search: string, hashtag = '') {
    const offset = page * limit - limit;
    const include: sequelize.Includeable[] = [{ all: true }];
    if (hashtag) {
      include.push({ model: HashTag, where: { value: hashtag } });
    }
    const posts = await this.postRepository.findAndCountAll({
      include,
      limit,
      offset,
      where: {
        title: { [Op.iLike]: `%${search}%` }
      },
      order: [['updatedAt', 'DESC']],
      distinct: true
    });
    return {
      count: posts.count,
      posts: posts.rows.map((post) => new ReturnPostDto(post))
    };
  }

  async edit(dto: EditPostDto, image) {
    const post = await this.postRepository.findOne({ where: { id: +dto.id } });
    if (!post) {
      throw new NotFoundException({ message: 'Post not found' });
    }
    if (post.userId !== +dto.userId) {
      throw new ForbiddenException({ message: 'UserId is not equal' });
    }
    if (post.image && !image) {
      await this.fileService.deleteFile(post.image);
    }
    let fileName = '';
    if (image) {
      fileName = await this.fileService.updateFile(image, dto.imageName);
    }
    await post.update({
      title: dto.title,
      content: dto.content,
      image: fileName
    });

    if (dto.hashtags) {
      const hashtags = await this.createHashTags(dto.hashtags);
      await post.$set('hashtags', hashtags);
    }

    return post;
  }

  async delete(id: number, user: TUserTokenPayload) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException({ message: 'Post not found' });
    }
    if (
      post.userId !== user.id &&
      !user.roles.find((role) => role.value === EUserRoles.ADMIN)
    ) {
      throw new ForbiddenException({ message: 'Forbidden' });
    }
    await this.postRepository.destroy({ where: { id } });
    if (post.image) {
      await this.fileService.deleteFile(post.image);
    }
    return null;
  }

  async getSinglePost(id: number, user: TUserTokenPayload | null) {
    const post = await this.postRepository.findOne({
      where: { id },
      include: { all: true }
    });
    if (!post) {
      throw new NotFoundException({ message: 'Post not found' });
    }
    if (user) {
      await this.updatePostViews(id, user.id);
    }
    const response = new ReturnPostDto(post);
    return { ...response };
  }

  async updatePostViews(postId, userId: number) {
    const candidate = await this.viewRepository.findOne({
      where: { postId, userId }
    });
    if (!candidate) {
      await this.viewRepository.create({ userId, postId });
    }
  }

  async addLike(dto: AddLikeDto) {
    const candidate = await this.likeRepository.findOne({
      where: { userId: dto.userId, postId: dto.postId }
    });
    if (candidate) {
      throw new ForbiddenException({ message: 'Like already exists' });
    }
    await this.likeRepository.create({ ...dto });
    const likes = await this.likeRepository.findAndCountAll({
      where: { postId: dto.postId }
    });
    return likes;
  }

  async deleteLike(dto: AddLikeDto) {
    const like = await this.likeRepository.findOne({
      where: { userId: dto.userId, postId: dto.postId }
    });
    if (!like) {
      throw new NotFoundException({ message: 'Like not found' });
    }
    await like.destroy();
    const likes = await this.likeRepository.findAndCountAll({
      where: { postId: dto.postId }
    });
    return likes;
  }

  async getPostLikes(postId: number) {
    const likes = await this.likeRepository.findAndCountAll({
      where: { postId }
    });
    if (!likes) {
      throw new NotFoundException({ message: 'Likes not found' });
    }
    return likes;
  }

  async addComment(dto: AddCommentDto) {
    await this.commentRepository.create({ ...dto });
    const comments = await this.commentRepository.findAndCountAll({
      where: { postId: dto.postId },
      include: { all: true },
      order: [['createdAt', 'DESC']]
    });
    return {
      count: comments.count,
      comments: comments.rows.map((comment) => new ReturnCommentDto(comment))
    };
  }

  async getPostComments(postId: number) {
    const comments = await this.commentRepository.findAndCountAll({
      where: { postId },
      include: { all: true },
      order: [['createdAt', 'DESC']]
    });
    if (!comments) {
      throw new NotFoundException({ message: 'Comments not found' });
    }
    return {
      count: comments.count,
      comments: comments.rows.map((comment) => new ReturnCommentDto(comment))
    };
  }

  async editComment(dto: EditCommentDto, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: +dto.id }
    });
    if (!comment) {
      throw new NotFoundException({ message: 'Comment not found' });
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException({ message: 'UserId is not equal' });
    }
    await comment.update({ text: dto.text });
    const comments = await this.commentRepository.findAndCountAll({
      where: { postId: comment.postId },
      include: { all: true },
      order: [['createdAt', 'DESC']]
    });
    return {
      count: comments.count,
      comments: comments.rows.map((comment) => new ReturnCommentDto(comment))
    };
  }

  async deleteComment(id: number, user: TUserTokenPayload) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException({ message: 'Comment not found' });
    }
    if (
      comment.userId !== user.id &&
      !user.roles.find((role) => role.value === EUserRoles.ADMIN)
    ) {
      throw new ForbiddenException({ message: 'UserId is not equal' });
    }
    await comment.destroy();
    const comments = await this.commentRepository.findAndCountAll({
      where: { postId: comment.postId },
      include: { all: true },
      order: [['createdAt', 'DESC']]
    });
    return {
      count: comments.count,
      comments: comments.rows.map((comment) => new ReturnCommentDto(comment))
    };
  }

  async getPostsByUser(userId: number) {
    const posts = await this.postRepository.findAndCountAll({
      include: { all: true },
      where: { userId },
      distinct: true
    });
    return {
      count: posts.count,
      posts: posts.rows.map((post) => new ReturnPostDto(post))
    };
  }

  async getPostsByUserLikes(userId: number) {
    const posts = await this.postRepository.findAndCountAll({
      include: [{ model: Like, where: { userId } }, { all: true }],
      distinct: true
    });
    return {
      count: posts.count,
      posts: posts.rows.map((post) => new ReturnPostDto(post))
    };
  }

  async getCommentsByUserId(userId: number) {
    const comments = await this.commentRepository.findAndCountAll({
      where: { userId },
      include: { all: true },
      distinct: true
    });
    return {
      count: comments.count,
      comments: comments.rows.map((comment) => new ReturnCommentDto(comment))
    };
  }

  async getPostsWithLikes(page = 1, limit = 5) {
    const offset = page * limit - limit;
    const posts = await this.postRepository.findAndCountAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Likes WHERE "postId" = "Post".id)'
            ),
            'likescount'
          ]
        ]
      },
      include: [{ model: Like, required: true }, { all: true }],
      limit,
      offset,
      distinct: true,
      order: [[sequelize.literal('likescount'), 'DESC']]
    });
    return {
      count: posts.count,
      posts: posts.rows.map((post) => new ReturnPostDto(post))
    };
  }

  async getPostsWithViews(page = 1, limit = 5) {
    const offset = page * limit - limit;
    const posts = await this.postRepository.findAndCountAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM views WHERE "postId" = "Post".id)'
            ),
            'viewsscount'
          ]
        ]
      },
      include: [{ model: View, required: true }, { all: true }],
      limit,
      offset,
      distinct: true,
      order: [[sequelize.literal('viewsscount'), 'DESC']]
    });
    return {
      count: posts.count,
      posts: posts.rows.map((post) => new ReturnPostDto(post))
    };
  }

  private async createHashTags(values: string[]) {
    await this.hashTagRepository.bulkCreate(
      [values].flat().map((value) => ({ value })),
      {
        ignoreDuplicates: true,
        returning: true
      }
    );
    return await this.hashTagRepository.findAll({ where: { value: values } });
  }
}
