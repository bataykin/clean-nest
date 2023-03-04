import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {Inject, NotFoundException, Query} from "@nestjs/common";
import {BlogsPaginationDto} from "../dto/blogsPaginationDto";
import {AuthService} from "../../auth/authService";
import {IPostsRepo, IPostsRepoToken} from "../../posts/IPostsRepo";
import {PostEntity} from "../../posts/entities/post.entity";
import {assignToken} from "@nestjs/core/middleware/utils";
import {PostService} from "../../posts/post.service";
import {IUsersRepo, IUsersRepoToken} from "../../users/IUsersRepo";
import {UserEntity} from "../../users/entity/user.entity";
import {LikeStatusEnum} from "../../comments/comment.schema";
import {ILikesRepo, ILikesRepoToken} from "../../likes/ILikesRepo";
import {LikeEntity} from "../../likes/entities/like.entity";

export class GetPostsByBlogCommand {
    constructor(public readonly bloggerId: string,
                public readonly dto: BlogsPaginationDto
                ) {
    }
}

@QueryHandler(GetPostsByBlogCommand)
export class GetPostsByBlogHandler implements IQueryHandler<GetPostsByBlogCommand> {
    constructor(@Inject(IPostsRepoToken)
                private readonly postsRepo: IPostsRepo<PostEntity>,
                @Inject(ILikesRepoToken)
                private readonly likesRepo: ILikesRepo<LikeEntity>,
                private readonly authService: AuthService,
    ) {
    }

    async execute(query: GetPostsByBlogCommand): Promise<any> {
        const {
            searchNameTerm = '',
            pageNumber = 1,
            pageSize = 10,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            skipSize = (+pageNumber > 1) ? (+pageSize * (+pageNumber - 1)) : 0
        }
            = query.dto
        const postsPaginationBLLdto = {
            searchNameTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            skipSize
        }
        const { bloggerId} = query
                const posts = await this.postsRepo.getPostsPaginatedByBlog(postsPaginationBLLdto, bloggerId)
        const mappedPosts = await this.likesRepo.mapArrayPostEntitiesToResponse(posts)

        const docCount = await this.postsRepo.countPostsByBlogId(bloggerId);
        const result = {
            "pagesCount": Math.ceil(docCount / pageSize),
            "page": +pageNumber,
            "pageSize": +pageSize,
            "totalCount": docCount,
            "items": mappedPosts
        }
        return result;


    }

}