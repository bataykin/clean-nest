import {CommandHandler, IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {Inject, UnauthorizedException} from "@nestjs/common";
import {IBlogsRepo, IBlogsRepoToken} from "../../bloggers/IBlogsRepo";
import {BlogEntity} from "../../bloggers/entities/blogEntity";
import {BlogsPaginationDto} from "../../bloggers/dto/blogsPaginationDto";

export class SAGetAllBloggersCommand {
    constructor(public readonly dto: BlogsPaginationDto) {
    }
}

@QueryHandler(SAGetAllBloggersCommand)
export class SAGetAllBloggersHandler implements  IQueryHandler<SAGetAllBloggersCommand> {
    constructor(@Inject(IBlogsRepoToken)
                private readonly blogsRepo: IBlogsRepo<BlogEntity>) {
    }

    async execute(query: SAGetAllBloggersCommand): Promise<any> {
        const {dto} = query
          const {
            searchNameTerm = '',
            pageNumber = 1,
            pageSize = 10,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            skipSize = (+pageNumber > 1) ? (+pageSize * (+pageNumber - 1)) : 0
        }
            = query.dto
        const blogsPaginationBLLdto = {
            searchNameTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            skipSize
        }
        const blogs = await this.blogsRepo.getBlogsPaginated(blogsPaginationBLLdto)
        const mappedBlogs = await this.blogsRepo.mapBlogsWithOwnersToResponse(blogs)
        const docCount = await this.blogsRepo.countBlogsBySearchname(searchNameTerm)
        const result = {
            "pagesCount": Math.ceil(docCount / +pageSize),
            "page": +pageNumber,
            "pageSize": +pageSize,
            "totalCount": docCount,
            "items": mappedBlogs
        }
        return result
    }

}