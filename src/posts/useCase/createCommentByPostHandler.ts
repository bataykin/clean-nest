import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Body, Inject, UnauthorizedException} from "@nestjs/common";
import {IPostsRepo, IPostsRepoToken} from "../IPostsRepo";
import {PostEntity} from "../entities/post.entity";
import {ICommentsRepo, ICommentsRepoToken} from "../../comments/ICommentsRepo";
import {CommentEntity} from "../../comments/entities/comment.entity";
import {Request} from "express";
import {PostService} from "../post.service";
import {AuthService} from "../../auth/authService";
import {IUsersRepo, IUsersRepoToken} from "../../users/IUsersRepo";
import {UserEntity} from "../../users/entity/user.entity";

export class CreateCommentByPostCommand {
    constructor(public readonly postId: string,
                public readonly content: string,
                public readonly accessToken: string) {
    }
}

@CommandHandler(CreateCommentByPostCommand)
export class CreateCommentByPostHandler implements  ICommandHandler<CreateCommentByPostCommand>{
    constructor(@Inject(ICommentsRepoToken)
                private readonly commentsRepo: ICommentsRepo<CommentEntity>,
                private readonly authService: AuthService,
                @Inject(IUsersRepoToken)
                private readonly usersRepo: IUsersRepo<UserEntity>,
                ) {
    }
    async execute(command: CreateCommentByPostCommand): Promise<any> {
        const { content, accessToken} = command
        const retrievedUserFromToken =
            (accessToken) ? await this.authService.retrieveUser(accessToken) : undefined
        const userIdFromToken = (retrievedUserFromToken) ? retrievedUserFromToken.userId : undefined
        if (!retrievedUserFromToken) {
            throw new UnauthorizedException('JWT wrong/not presented')
        }
        const isBanned = await this.usersRepo.getBanStatus(userIdFromToken)
        if (isBanned) throw new UnauthorizedException('user is banned, sorry))')


        // const login = retrievedUserFromToken.username
        // return this.commentsService.createCommentByPost(login, userId, postId, content)

        // console.log(retrievedUserFromToken)
        const comment = {

            content: content,
            userId: retrievedUserFromToken.userId,
            userLogin: retrievedUserFromToken.username,
            addedAt: new Date(),

            postId: command.postId
        }
        const createdComment = await this.commentsRepo.createComment(comment)
        const {postId, ...rest} = createdComment
        const res = {
            ...rest,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None"
            },
        }

        return Promise.resolve(res);
    }

}