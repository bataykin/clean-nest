import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {CommentsMongoService} from './oldServiceRepos/comments.Mongo.service';
import {CommentsController} from './comments.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../users/user.schema";
import {Comment, CommentSchema} from "./comment.schema";
import {CommentsMongoRepo} from "./oldServiceRepos/comments.Mongo.repo";
import {AuthModule, useAuthServiceClass} from "../auth/auth.module";
import {UsersModule} from "../users/users.module";
import {PostsCheckUriBeforeBodyMiddleware} from "../middlewares/posts-check-uri-before-body-middleware.service";
import {CommentsCheckUriBeforeBodyMiddleware} from "../middlewares/comments-check-uri-before-body-middleware.service";
import {CommentsSQLService} from "./oldServiceRepos/comments.SQL.service";
import {CommentsSQLRepo} from "./oldServiceRepos/comments.SQL.repo";
import {LikesModule} from "../likes/likes.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../users/entity/user.entity";
import {ReftokenEntity} from "../auth/entities/reftoken.entity";
import {CommentEntity} from "./entities/comment.entity";
import {AAuthService} from "../auth/oldServiceRepos/IAuthService";
import {ACommentService} from "./oldServiceRepos/ICommentService";
import {AuthMongoService} from "../auth/oldServiceRepos/auth.Mongo.service";
import {AuthSQLService} from "../auth/oldServiceRepos/auth.SQL.service";
import {AuthORMService} from "../auth/oldServiceRepos/auth.ORM.service";
import {CommentsORMService} from "./oldServiceRepos/comments.ORM.service";
import {CommentsORMRepo} from "./oldServiceRepos/comments.ORM.repo";
import {IPostsRepoToken} from "../posts/IPostsRepo";
import {useRepositoryClassGeneric} from "../common/useRepositoryClassGeneric";
import {PostsORM} from "../posts/posts.ORM";
import {ICommentsRepoToken} from "./ICommentsRepo";
import {CommentsORM} from "./comments.ORM";
import {CqrsModule} from "@nestjs/cqrs";
import {GetCommentByIdHandler} from "./useCase/getCommentByIdHandler";
import {UpdateCommentHandler} from "./useCase/updateCommentCommand";
import {RemoveCommentHandler} from "./useCase/removeCommentHandler";
import {SetLikeStatusHandler} from "./useCase/setLikeStatusHandler";
import {ILikesRepoToken} from "../likes/ILikesRepo";
import {LikesORM} from "../likes/likesORM";
import {LikeEntity} from "../likes/entities/like.entity";
import {IUsersRepoToken} from "../users/IUsersRepo";
import {UsersORM} from "../users/users.ORM";

export const useCommentServiceClass = () => {
    if (process.env.REPO_TYPE === 'MONGO') {
        return CommentsMongoService
    } else if (process.env.REPO_TYPE === 'SQL') {
        return CommentsSQLService
    } else if (process.env.REPO_TYPE === 'ORM') {
        return CommentsORMService
    } else return CommentsMongoService // by DEFAULT if not in enum
}

const commentsRouteHandlers = [
    GetCommentByIdHandler,
    UpdateCommentHandler,
    RemoveCommentHandler,
    SetLikeStatusHandler

]

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([CommentEntity, LikeEntity, UserEntity]),
        MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]),
        AuthModule,
        UsersModule,
        LikesModule
    ],
    controllers: [CommentsController],
    providers: [
        ...commentsRouteHandlers,

        {
            provide: ICommentsRepoToken,
            useClass: useRepositoryClassGeneric(CommentsORM, CommentsORM, CommentsORM)
        },
        {
            provide: ILikesRepoToken,
            useClass: useRepositoryClassGeneric(LikesORM, LikesORM, LikesORM)
        },
        {
            provide: IUsersRepoToken,
            useClass: useRepositoryClassGeneric(UsersORM, UsersORM, UsersORM)
        },
        // CommentsORMService,
        // CommentsORMRepo,
        //
        // CommentsSQLService,
        // CommentsSQLRepo,
        //
        //
        // CommentsMongoService,
        // CommentsMongoRepo,
        CommentsCheckUriBeforeBodyMiddleware
    ],
    exports: [
        {
            provide: ICommentsRepoToken,
            useClass: useRepositoryClassGeneric(CommentsORM, CommentsORM, CommentsORM)
        },
        // CommentsMongoService,
        // CommentsMongoRepo,
        //
        // CommentsSQLService,
        // CommentsSQLRepo,
        //
        // CommentsORMService,
        // CommentsORMRepo
    ]
})
export class CommentsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CommentsCheckUriBeforeBodyMiddleware)
            .forRoutes('comments');
    }
}