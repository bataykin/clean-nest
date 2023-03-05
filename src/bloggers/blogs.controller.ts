import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { GetPostsByBlogCommand } from './useCase/getPostsByBlogHandler';
import { BlogsPaginationDto } from './dto/blogsPaginationDto';
import { FindBlogCommand } from './useCase/findBlogHandler';
import { QueryBus } from '@nestjs/cqrs';
import { SA_GetAllBlogsQuery } from '../superadmin/useCase/SAGetAllBloggersHandler';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getBlogs(
    /*@Param('id', ParseUUIDPipe) id: string,*/
    @Query() dto: BlogsPaginationDto,
  ) {
    return this.queryBus.execute(new SA_GetAllBlogsQuery(dto));
  }

  @Get(':blogId/posts')
  async getPostsByBlogger(
    @Param('blogId', ParseUUIDPipe) bloggerId: string,
    @Query() dto: BlogsPaginationDto,
  ) {
    return this.queryBus.execute(new GetPostsByBlogCommand(bloggerId, dto));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findBlog(@Param('id', ParseUUIDPipe) id: string) {
    return this.queryBus.execute(new FindBlogCommand(id));
  }
}
