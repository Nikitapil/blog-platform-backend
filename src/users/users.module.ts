import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {Post} from "../posts/post.model";
import {Like} from "../posts/like.model";
import {Comment} from "../posts/comment.model";
import {View} from "../posts/view.model";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      SequelizeModule.forFeature([User, Role, UserRoles, Post, Like, Comment, View]),
      forwardRef(() => AuthModule),
      RolesModule
  ],
    exports: [UsersService]
})
export class UsersModule {}
