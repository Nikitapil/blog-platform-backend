import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Post} from "./post.model";
import {FilesModule} from "../files/files.module";
import {AuthModule} from "../auth/auth.module";
import {Like} from "./like.model";

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
      SequelizeModule.forFeature([User, Post, Like]),
      FilesModule,
      AuthModule
  ]
})
export class PostsModule {}
