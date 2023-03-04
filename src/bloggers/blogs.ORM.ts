import {IBlogsRepo} from "./IBlogsRepo";
import {BlogEntity} from "./entities/blogEntity";
import {CreateBloggerDto} from "./dto/create.blogger.dto";
import {BlogsPaginationDto} from "./dto/blogsPaginationDto";
import {UpdateBlogDto} from "./dto/update-blog.dto";
import {InjectDataSource, InjectRepository} from "@nestjs/typeorm";
import {DataSource, Repository} from "typeorm";
import {UserEntity} from "../users/entity/user.entity";
import {use} from "passport";

export class BlogsORM extends Repository<BlogEntity>
    implements IBlogsRepo<BlogEntity> {
    constructor(@InjectRepository(BlogEntity)
                private readonly blogsRepo: Repository<BlogEntity>,) {
        super(BlogEntity, blogsRepo.manager, blogsRepo.queryRunner);
    }

   async  setBanStatus(blogId: string, isBanned: boolean): Promise<void> {
       await this.blogsRepo.update(
            {id: blogId},
            {isBanned, banDate: new Date()})
    }



    async getUsersBlogsPaginated(dto: BlogsPaginationDto, userIdFromToken: string): Promise<BlogEntity[]> {
        dto.searchNameTerm = dto.searchNameTerm == null ? '' : dto.searchNameTerm
        if (dto.sortBy === 'createdAt') {
            let blogs = await this.blogsRepo
                .createQueryBuilder('blogs')
                .where("LOWER(blogs.name) like LOWER(:name)",
                    {name: `%${dto.searchNameTerm}%`})
                .andWhere('blogs.userId = :userId', {userId: userIdFromToken})
                .skip(dto.skipSize)
                .take(dto.pageSize)
                .orderBy('blogs.' + dto.sortBy
                    // + ' COLLATE "C"'
                    /*+ '::bytea'*/
                    ,
                    dto.sortDirection === "asc" ? "ASC" : "DESC", "NULLS LAST")
                .getMany()
            return blogs
        } else {
            let blogs = await this.blogsRepo
                .createQueryBuilder('blogs')
                .where("LOWER(blogs.name) like LOWER(:name)",
                    {name: `%${dto.searchNameTerm}%`})
                .andWhere('blogs.userId = :userId', {userId: userIdFromToken})
                .skip(dto.skipSize)
                .take(dto.pageSize)
                .orderBy('blogs.' + dto.sortBy
                    + ' COLLATE "C"'
                    /*+ '::bytea'*/
                    ,
                    dto.sortDirection === "asc" ? "ASC" : "DESC", "NULLS LAST")
                .getMany()
            return blogs
        }
    }

    async countBlogs(): Promise<number> {
        return await this.blogsRepo.count()
    }

    async createBlog(dto: CreateBloggerDto, userId: string): Promise<BlogEntity> {
        const blog = new BlogEntity()
        blog.name = dto.name
        blog.youtubeUrl = dto.youtubeUrl
        blog.userId = userId
        await this.blogsRepo.manager.save(blog)
        return blog
    }

    async deleteBlog(id: string): Promise<any> {
        return await this.blogsRepo.delete(id)
    }

    async findBlogById(id: string): Promise<BlogEntity | null> {
        return await this.blogsRepo.findOneBy({id})
    }

    async getBlogNameById(id: string): Promise<string> {
        const blogger = await this.blogsRepo.findOneBy({id})
        return blogger.name
    }

    async getBlogsPaginated(dto: BlogsPaginationDto): Promise<BlogEntity[]> {
        // according to swagger default value of searchNameTerm is null, but its not working so
        dto.searchNameTerm = dto.searchNameTerm == null ? '' : dto.searchNameTerm
        if (dto.sortBy === 'createdAt') {
            let blogs = await this.blogsRepo
                .createQueryBuilder('blogs')
                .where("LOWER(blogs.name) like LOWER(:name)",
                    {name: `%${dto.searchNameTerm}%`})
                .skip(dto.skipSize)
                .take(dto.pageSize)
                .orderBy('blogs.' + dto.sortBy
                    // + ' COLLATE "C"'
                    /*+ '::bytea'*/
                    ,
                    dto.sortDirection === "asc" ? "ASC" : "DESC", "NULLS LAST")
                .getMany()
            return blogs
        } else {
            let blogs = await this.blogsRepo
                .createQueryBuilder('blogs')
                .where("LOWER(blogs.name) like LOWER(:name)",
                    {name: `%${dto.searchNameTerm}%`})
                .skip(dto.skipSize)
                .take(dto.pageSize)
                .orderBy('blogs.' + dto.sortBy
                    + ' COLLATE "C"'
                    /*+ '::bytea'*/
                    ,
                    dto.sortDirection === "asc" ? "ASC" : "DESC", "NULLS LAST")
                .getMany()
            return blogs
        }
    }

    async isBlogExistsByName(dto: CreateBloggerDto): Promise<BlogEntity | null> {
        return await this.blogsRepo.findOneBy({name: dto.name})
    }

    async updateBlog(id: string, dto: UpdateBlogDto): Promise<any> {
        return await this.blogsRepo.update(
            {id: id},
            {name: dto.name, youtubeUrl: dto.youtubeUrl})
    }

    async countBlogsBySearchname(searchNameTerm: string) {
        return await this.blogsRepo.createQueryBuilder('b')
            .where("LOWER(b.name) like LOWER(:name)",
                {name: `%${searchNameTerm}%`})
            .getCount()
    }

    async countUsersBlogsBySearchname(searchNameTerm: string, userId: string) {
        return await this.blogsRepo.createQueryBuilder('b')
            .where("LOWER(b.name) like LOWER(:name)",
                {name: `%${searchNameTerm}%`})
            .andWhere('b.userId = :userId', {userId: userId})

            .getCount()
    }

    async bindBlogToUser(blogId: string, userId: string) {
        await this.blogsRepo.update({id: blogId}, {user: {id: userId}})
        const blog = await this.blogsRepo.findOneBy({id: blogId})
        console.log(blog.name, 'NOT IMPL BIND')
    }


    async mapBlogsToResponse(blogs: BlogEntity[], ...rows: string[]) {
        const mappedBlogs = []
        for await (let blog of blogs) {
            let result: any = {}
            for await (let row of rows) {
                result[row] = blog[row]
            }
            mappedBlogs.push(result)
        }
        return mappedBlogs
    }

    async mapBlogToResponse(blog: BlogEntity, ...rows: string[]) {
        const result = {}

        for await (let row of rows) {
            result[row] = blog[row]
        }

        return result
    }

    async mapBlogsWithOwnersToResponse(blogs: BlogEntity[]) {
        const mappedBlogs = []
        for await (let blog of blogs) {

            let user = await this.blogsRepo
                .createQueryBuilder('blogs')
                .leftJoinAndSelect("blogs.user", "user")
                // .addSelect('users.login', 'login')
                .where("blogs.id = :blogId", {blogId: blog.id})
                .getRawOne()


            let result: any = {
                id: blog.id,
                name: blog.name,
                youtubeUrl: blog.youtubeUrl,
                createdAt: blog.createdAt,
                blogOwnerInfo: {
                    userId: blog.userId,
                    userLogin: user.user_login,
                },
                banInfo: {
                    isBanned: blog.isBanned,
                    banDate: blog.banDate
                }
            }
            mappedBlogs.push(result)
        }
        return mappedBlogs
    }


}