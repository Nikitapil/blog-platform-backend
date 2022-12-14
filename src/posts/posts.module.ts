import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Post} from "./post.model";

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
      SequelizeModule.forFeature([User, Post])
  ]
})
export class PostsModule {}
