import { forwardRef, Module } from '@nestjs/common';
import { BloggersMongoService } from './oldServicesRepos/bloggers.Mongo.service';
import { BloggersController } from './bloggers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blogger, BloggerSchema } from './blogger.schema';
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloggersSQLService } from './oldServicesRepos/bloggers.SQL.service';
import { BlogEntity } from './entities/blogEntity';
import { LikesModule } from '../likes/likes.module';
import { UsersModule } from '../users/users.module';
import { BlogService } from './blog.service';
import { IBlogsRepoToken } from './IBlogsRepo';
import { BlogsORM } from './blogs.ORM';
import { useRepositoryClassGeneric } from '../common/useRepositoryClassGeneric';
import { PostEntity } from '../posts/entities/post.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { GetBlogsOfBloggerHandler } from './useCase/getBlogsOfBloggerHandler';
import { CreateBlogHandler } from './useCase/createBlogHandler';
import { RemoveBlogHandler } from './useCase/removeBlogHandler';
import { UpdateBlogHandler } from './useCase/updateBlogHandler';
import { FindBlogHandler } from './useCase/findBlogHandler';
import { GetPostsByBlogHandler } from './useCase/getPostsByBlogHandler';
import { IPostsRepoToken } from '../posts/IPostsRepo';
import { PostsORM } from '../posts/posts.ORM';
import { IUsersRepoToken } from '../users/IUsersRepo';
import { UsersORM } from '../users/users.ORM';
import { UserEntity } from '../users/entity/user.entity';
import { CreatePostByBlogHandler } from './useCase/createPostByBlogHandler';
import { ILikesRepoToken } from '../likes/ILikesRepo';
import { LikesORM } from '../likes/likesORM';
import { LikeEntity } from '../likes/entities/like.entity';
import { DeletePostByBlogHandler } from './useCase/DeletePostByBlogHandler';
import { UpdatePostByBlogHandler } from './useCase/UpdatePostByBlogHandler';
import { BlogsController } from './blogs.controller';
import { BannedUsersEntity } from './entities/bannedUsersEntity';
import { GetAllCommentsOnMyBlogHandler } from './useCase/getAllCommentsOnMyBlogHandler';
import { ICommentsRepoToken } from '../comments/ICommentsRepo';
import { CommentsORM } from '../comments/comments.ORM';
import { CommentEntity } from '../comments/entities/comment.entity';
import { BanUnbanUserByBlogHandler } from './useCase/BanUnbanUserByBlogHandler';
import { GetAllBlogsHandler } from './useCase/getAllBlogsPublic';
//import {BlogPostModule} from "../BlogPostModule/blogPost.module";

const useBloggerServiceClass = () => {
  if (process.env.REPO_TYPE === 'MONGO') {
    return BloggersMongoService;
  } else if (process.env.REPO_TYPE === 'SQL') {
    return BloggersSQLService;
  } else if (process.env.REPO_TYPE === 'ORM') {
    return BlogsORM;
  } else return BloggersMongoService; // by DEFAULT if not in enum
};

const blogsRouteHandlers = [
  GetBlogsOfBloggerHandler,
  GetAllBlogsHandler,
  CreateBlogHandler,
  RemoveBlogHandler,
  UpdateBlogHandler,
  FindBlogHandler,
  GetPostsByBlogHandler,

  CreatePostByBlogHandler,
  UpdatePostByBlogHandler,
  DeletePostByBlogHandler,

  GetAllCommentsOnMyBlogHandler,
  BanUnbanUserByBlogHandler,
];

// let a = useServiceClassGeneric<BloggersMongoService, BloggersSQLService, BloggersORMService>(BloggersMongoService, BloggersSQLService, BloggersORMService)

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      BlogEntity,
      BannedUsersEntity,
      PostEntity,
      UserEntity,
      LikeEntity,
      CommentEntity,
    ]),

    MongooseModule.forFeature([{ name: Blogger.name, schema: BloggerSchema }]),
    forwardRef(() => PostsModule),
    // PostsModule,
    //BlogPostModule,
    AuthModule,
    UsersModule,
    LikesModule,
  ],

  controllers: [BloggersController, BlogsController],

  providers: [
    ...blogsRouteHandlers,
    BlogService,
    {
      provide: IBlogsRepoToken,
      useClass: useRepositoryClassGeneric(BlogsORM, BlogsORM, BlogsORM),
    },
    {
      provide: IPostsRepoToken,
      useClass: useRepositoryClassGeneric(PostsORM, PostsORM, PostsORM),
    },
    {
      provide: IUsersRepoToken,
      useClass: useRepositoryClassGeneric(UsersORM, UsersORM, UsersORM),
    },
    {
      provide: ILikesRepoToken,
      useClass: useRepositoryClassGeneric(LikesORM, LikesORM, LikesORM),
    },
    {
      provide: ICommentsRepoToken,
      useClass: useRepositoryClassGeneric(
        CommentsORM,
        CommentsORM,
        CommentsORM,
      ),
    },

    // {
    //     provide: ABloggersService,
    //     useClass: useBloggerServiceClass()
    //     // process.env.REPO_TYPE === 'MONGO' ? BloggersMongoService : BloggersSQLService,
    // },
    // {
    //     provide: APostService,
    //     useClass: usePostServiceClass()
    //     // process.env.REPO_TYPE === 'MONGO' ? BloggersMongoService : BloggersSQLService,
    // },
    // {
    //     provide: AAuthService,
    //     useClass: useAuthServiceClass()
    //     // process.env.REPO_TYPE === 'MONGO' ? BloggersMongoService : BloggersSQLService,
    // },

    // BloggersORMService,
    // BloggersORMRepo,
    //
    //
    // BloggersSQLService,
    // BloggersSQLRepo,
    //
    // BloggersMongoService,
    // BloggersMongoRepo,

    // LikesORMService,
    // LikesORMRepo,

    // UsersORMRepo,
  ],
  exports: [
    IBlogsRepoToken,
    BlogService,

    // BloggersSQLService,
    // BloggersSQLRepo,
    //
    // BloggersMongoService,
    //
    // BloggersORMService,
    // BloggersORMRepo,
  ],
})
export class BloggersModule {}
