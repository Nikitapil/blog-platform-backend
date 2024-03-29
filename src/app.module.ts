import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/post.model';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { Token } from './auth/token.model';
import { Like } from './posts/like.model';
import { Comment } from './posts/comment.model';
import { View } from './posts/view.model';
import { HashTag } from './posts/hashtag.model';
import { HashtagPost } from './posts/hashtag-post.model';
import * as pg from 'pg';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({}),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static')
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      dialectModule: pg,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Role,
        UserRoles,
        Post,
        Token,
        Like,
        Comment,
        View,
        HashTag,
        HashtagPost
      ],
      autoLoadModels: true
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    PostsModule,
    FilesModule
  ]
})
export class AppModule {}
