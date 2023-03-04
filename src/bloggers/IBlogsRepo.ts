import {CreateBloggerDto} from "./dto/create.blogger.dto";
import {UpdateBlogDto} from "./dto/update-blog.dto";
import {BlogsPaginationDto} from "./dto/blogsPaginationDto";
import {BlogEntity} from "./entities/blogEntity";

export const IBlogsRepoToken = Symbol('IBlogsRepoToken')

export interface IBlogsRepo<GenericBlogType> {

    createBlog(dto: CreateBloggerDto, userId: string): Promise<GenericBlogType>

    updateBlog(id: string, dto: UpdateBlogDto): Promise<GenericBlogType>

    deleteBlog(id: string): Promise<any>

    findBlogById(id: string): Promise<GenericBlogType>

    countBlogs(): Promise<number>

    getBlogsPaginated(dto: BlogsPaginationDto): Promise<GenericBlogType[] | null>


    isBlogExistsByName(dto: CreateBloggerDto): Promise<GenericBlogType | null>

    getBlogNameById(id: string): Promise<string | null>

    countBlogsBySearchname(searchNameTerm: string)

    countUsersBlogsBySearchname(searchNameTerm: string, userId: string)

    bindBlogToUser(blogId: string, userId: string)

    mapBlogsToResponse(blogs: BlogEntity[], ...rows: string[])

    mapBlogToResponse(blogs: BlogEntity, ...rows: string[])

    mapBlogsWithOwnersToResponse(blogs: BlogEntity[])

    getUsersBlogsPaginated(dto: BlogsPaginationDto, userIdFromToken: string): Promise<GenericBlogType[] | null>

    setBanStatus(blogId: string, isBanned: boolean): void
}