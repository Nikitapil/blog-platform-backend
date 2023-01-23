import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Post} from "./post.model";
import {FilesModule} from "../files/files.module";
import {AuthModule} from "../auth/auth.module";
import {Like} from "./like.model";
import {Comment} from "./comment.model";
import {View} from "./view.model";

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
      SequelizeModule.forFeature([User, Post, Like, Comment, View]),
      FilesModule,
      AuthModule
  ]
})
export class PostsModule {}
