import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
    Query
} from '@nestjs/common';
import {GetPostsByBlogCommand} from "./useCase/getPostsByBlogHandler";
import {BlogsPaginationDto} from "./dto/blogsPaginationDto";
import {FindBlogCommand} from "./useCase/findBlogHandler";
import {QueryBus} from "@nestjs/cqrs";
import {GetAllBlogsCommand} from "./useCase/getAllBloggersHandler";
import {SAGetAllBloggersCommand} from "../superadmin/useCase/SAGetAllBloggersHandler";


@Controller('blogs')
export class BlogsController {
    constructor(private readonly queryBus: QueryBus) {
    }


    @Get()
    @HttpCode(HttpStatus.OK)
    async getBlogs(/*@Param('id', ParseUUIDPipe) id: string,*/
                   @Query() dto: BlogsPaginationDto) {
        return this.queryBus.execute(new SAGetAllBloggersCommand(dto))
    }

    @Get(':blogId/posts')
    async getPostsByBlogger(@Param('blogId', ParseUUIDPipe) bloggerId: string,
                            @Query() dto: BlogsPaginationDto) {
        return this.queryBus.execute(new GetPostsByBlogCommand(bloggerId, dto))
    }


    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findBlog(@Param('id', ParseUUIDPipe) id: string) {
        return this.queryBus.execute(new FindBlogCommand(id))
    }


}
