import {forwardRef, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {PostsMongoService} from './oldServicesRepos/posts.Mongo.service';
import {PostsController} from './posts.controller';
import {CommentsMongoService} from "../comments/oldServiceRepos/comments.Mongo.service";
import {PostsMongoRepo} from "./oldServicesRepos/posts.Mongo.repo";
import {MongooseModule} from "@nestjs/mongoose";
import {Post, PostSchema} from "./post.schema";
import {BloggersModule} from "../bloggers/bloggers.module";
import {CommentsModule, useCommentServiceClass} from "../comments/comments.module";
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "../auth/constants";
import {AuthModule, useAuthServiceClass} from "../auth/auth.module";
import {UsersModule} from "../users/users.module";
import {PostsCheckUriBeforeBodyMiddleware} from "../middlewares/posts-check-uri-before-body-middleware.service";
import {LoggerMiddleware} from "../middlewares/logger.middleware";
import {PostsSQLService} from "./oldServicesRepos/posts.SQL.service";
import {PostsSQLRepo} from "./oldServicesRepos/posts.SQL.repo";
import {CommentsSQLService} from "../comments/oldServiceRepos/comments.SQL.service";
import {LikesModule} from "../likes/likes.module";
import {BloggersMongoService} from "../bloggers/oldServicesRepos/bloggers.Mongo.service";
import {BloggersSQLService} from "../bloggers/oldServicesRepos/bloggers.SQL.service";
import {BloggersORMService} from "../bloggers/oldServicesRepos/bloggers.ORM.service";
import {PostsORMService} from "./oldServicesRepos/posts.ORM.service";
import {APostService} from "./oldServicesRepos/IPostService";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BlogEntity} from "../bloggers/entities/blogEntity";
import {PostEntity} from "./entities/post.entity";
import {PostORMRepo} from "./oldServicesRepos/post.ORM.repo";
import {AAuthService} from "../auth/oldServiceRepos/IAuthService";
import {ReftokenSQLRepo} from "../auth/oldServiceRepos/reftoken.SQL.repo";
import {ACommentService} from "../comments/oldServiceRepos/ICommentService";
import {PostService} from "./post.service";
import {IPostsRepoToken} from "./IPostsRepo";
import {PostsORM} from "./posts.ORM";
import {useRepositoryClassGeneric} from "../common/useRepositoryClassGeneric";
import {IBlogsRepoToken} from "../bloggers/IBlogsRepo";
import {BlogsORM} from "../bloggers/blogs.ORM";
import {BlogService} from "../bloggers/blog.service";
import {BlogPostService} from "../BlogPostModule/blog.post.service";
import {CqrsModule} from "@nestjs/cqrs";
import {SayHelloHandler} from "./useCase/sayHelloHandler";
import {GetAllPostsHandler} from "./useCase/getAllPostsHandler";
import {CreatePostHandler} from "./useCase/createPostHandler";
import {FindPostByIdCommand, FindPostByIdHandler} from "./useCase/findPostByIdHandler";
import {UpdateBlogCommand, UpdatePostHandler} from "./useCase/updatePostHandler";
import {RemovePostHandler} from "./useCase/removePostHandler";
import {GetCommentsByPostHandler} from "./useCase/getCommentsByPostHandler";
import {CreateCommentByPostHandler} from "./useCase/createCommentByPostHandler";
import {ICommentsRepoToken} from "../comments/ICommentsRepo";
import {CommentsORM} from "../comments/comments.ORM";
import {CommentEntity} from "../comments/entities/comment.entity";
import {AuthService} from "../auth/authService";
import {IUsersRepoToken} from "../users/IUsersRepo";
import {UsersORM} from "../users/users.ORM";
import {UserEntity} from "../users/entity/user.entity";
import {ILikesRepoToken} from "../likes/ILikesRepo";
import {LikesORM} from "../likes/likesORM";
import {LikeEntity} from "../likes/entities/like.entity";
import {SetLikeToPostHandler} from "./useCase/setLikeToPostHandler";
import {IsBlogExistConstraint} from "../bloggers/decorators/isBloggerExistsDecorator";
//import {BlogPostModule} from "../BlogPostModule/blogPost.module";

export const usePostServiceClass = () => {
    if (process.env.REPO_TYPE === 'MONGO') {
        return PostsMongoService
    } else if (process.env.REPO_TYPE === 'SQL') {
        return PostsSQLService
    } else if (process.env.REPO_TYPE === 'ORM') {
        return PostsORMService
    } else return PostsMongoService // by DEFAULT if not in enum
}

const PostRouteHandlers = [
    GetAllPostsHandler,
    CreatePostHandler,
    FindPostByIdHandler,
    UpdatePostHandler,
    RemovePostHandler,
    SetLikeToPostHandler,

    GetCommentsByPostHandler,
    CreateCommentByPostHandler,
]

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([PostEntity, CommentEntity, BlogEntity, UserEntity, LikeEntity]),
        MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '60s'},
        }),
        // LikesModule,
        CommentsModule,
        AuthModule,
        UsersModule,
        forwardRef(() => BloggersModule),
        //BlogPostModule,
        // BloggersModule,
    ],


    controllers: [PostsController],

    providers: [
        IsBlogExistConstraint,

        ...PostRouteHandlers,

        PostService,
        {
            provide: IPostsRepoToken,
            useClass: useRepositoryClassGeneric(PostsORM, PostsORM, PostsORM)
        },
        {
            provide: ICommentsRepoToken,
            useClass: useRepositoryClassGeneric(CommentsORM, CommentsORM, CommentsORM)
        },
        {
            provide: IUsersRepoToken,
            useClass: useRepositoryClassGeneric(UsersORM, UsersORM, UsersORM)
        },
        {
            provide: ILikesRepoToken,
            useClass: useRepositoryClassGeneric(LikesORM, LikesORM, LikesORM)
        },
        {
            provide: IBlogsRepoToken,
            useClass: useRepositoryClassGeneric(BlogsORM, BlogsORM, BlogsORM)
        },
        AuthService,
        // {
        //     provide: IBlogsRepoToken,
        //     useClass: useRepositoryClassGeneric(BlogsORM, BlogsORM, BlogsORM)
        // },

        // BlogService,
        // BlogPostService,


        //
        // PostsORMService,
        // PostORMRepo,
        //
        //
        // PostsSQLService,
        // PostsSQLRepo,
        //
        // PostsMongoService,
        // PostsMongoRepo,
        //
        // CommentsMongoService,
        // CommentsSQLService,

        PostsCheckUriBeforeBodyMiddleware,

    ],

    exports: [
        IPostsRepoToken,
        PostService,

        // PostsMongoService,
        // PostsSQLService,
        // PostsSQLRepo,
        //
        // PostsORMService,
        // PostORMRepo,

    ]
})
export class PostsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(PostsCheckUriBeforeBodyMiddleware)
            .forRoutes('posts');
    }
}
