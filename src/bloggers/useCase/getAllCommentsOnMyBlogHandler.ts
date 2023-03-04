import {CommandHandler, ICommandHandler, IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {BlogsPaginationDto} from "../dto/blogsPaginationDto";
import {Inject, UnauthorizedException} from "@nestjs/common";
import {IBlogsRepo, IBlogsRepoToken} from "../IBlogsRepo";
import {BlogEntity} from "../entities/blogEntity";
import {AuthService} from "../../auth/authService";
import {IUsersRepo, IUsersRepoToken} from "../../users/IUsersRepo";
import {UserEntity} from "../../users/entity/user.entity";
import {ICommentsRepo, ICommentsRepoToken} from "../../comments/ICommentsRepo";
import {CommentEntity} from "../../comments/entities/comment.entity";
import {ILikesRepo, ILikesRepoToken} from "../../likes/ILikesRepo";
import {LikeEntity} from "../../likes/entities/like.entity";

export class GetAllCommentsOnMyBlogCommand {
    constructor(public readonly dto: BlogsPaginationDto,
                public readonly accessToken: string) {
    }
}
@QueryHandler(GetAllCommentsOnMyBlogCommand)
export  class GetAllCommentsOnMyBlogHandler implements IQueryHandler<GetAllCommentsOnMyBlogCommand>{
    constructor(@Inject(ICommentsRepoToken)
                private readonly commentsRepo: ICommentsRepo<CommentEntity>,
                private readonly authService: AuthService,
                @Inject(IUsersRepoToken)
                private readonly usersRepo: IUsersRepo<UserEntity>,
                @Inject(ILikesRepoToken)
                private readonly likesRepo: ILikesRepo<LikeEntity>) {
    }
    async execute(query: GetAllCommentsOnMyBlogCommand): Promise<any> {
        const {dto, accessToken} = query
        const retrievedUserFromToken =
            (accessToken) ? await this.authService.retrieveUser(accessToken) : undefined
        const userIdFromToken = (retrievedUserFromToken) ? retrievedUserFromToken.userId : undefined
        const isBanned = await this.usersRepo.getBanStatus(userIdFromToken)
        if (isBanned) throw new UnauthorizedException('user is banned, sorry))')

        const {
            searchNameTerm = '',
            pageNumber = 1,
            pageSize = 10,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            skipSize = (+pageNumber > 1) ? (+pageSize * (+pageNumber - 1)) : 0
        }
            = query.dto
        const commentsPaginationBLLdto = {
            searchNameTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            skipSize
        }

        const allComments = await this.commentsRepo.getAllCommentByBlog(userIdFromToken, commentsPaginationBLLdto)
        const mappedComments = await this.likesRepo.mapArrayCommentEntitiesToResponse(allComments)




        return mappedComments
    }

}