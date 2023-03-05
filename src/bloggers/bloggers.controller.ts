import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CreateBloggerDto } from './dto/create.blogger.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogsPaginationDto } from './dto/blogsPaginationDto';
import { CreatPostByBlogDto } from './dto/creatPostByBlogDto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllBlogsCommand } from './useCase/getAllBloggersHandler';
import { CreateBlogCommand } from './useCase/createBlogHandler';
import { RemoveBlogCommand } from './useCase/removeBlogHandler';
import { UpdateBlogCommand } from './useCase/updateBlogHandler';
import { CreatePostByBlogCommand } from './useCase/createPostByBlogHandler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePostByBlogDto } from './dto/UpdatePostByBlogDto';
import { SkipThrottle } from '@nestjs/throttler';
import { UpdatePostByBlogCommand } from './useCase/UpdatePostByBlogHandler';
import { DeletePostByBlogCommand } from './useCase/DeletePostByBlogHandler';
import { ChangeBlogByOtherUserInterceptor } from './interceptors/blogMutationInterceptor';
import { ChangePostByOtherUserInterceptor } from './interceptors/postMutationInterceptor';
import { GetAllCommentsOnMyBlogCommand } from './useCase/getAllCommentsOnMyBlogHandler';
import { BanUserByBlogDto } from './dto/banUserByBlogDto';
import { BanUnbanUserByBlogCommand } from './useCase/BanUnbanUserByBlogHandler';

@SkipThrottle()
@Controller('blogger')
export class BloggersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('blogs/comments')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getAllCommentsOnMyBlog(
    @Query() dto: BlogsPaginationDto,
    @Request() req,
  ) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    return this.queryBus.execute(
      new GetAllCommentsOnMyBlogCommand(dto, accessToken),
    );
  }

  @Delete('blogs/:id')
  @UseInterceptors(ChangeBlogByOtherUserInterceptor)
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async removeBlog(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    return this.commandBus.execute(new RemoveBlogCommand(id, accessToken));
  }

  @Put('blogs/:id')
  @UseInterceptors(ChangeBlogByOtherUserInterceptor)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBlogDto,
    @Request() req,
  ) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    return this.commandBus.execute(new UpdateBlogCommand(id, dto, accessToken));
  }

  @Post('blogs/:blogId/posts')
  @UseGuards(JwtAuthGuard)
  async createPostByBlog(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Body() dto: CreatPostByBlogDto,
    @Request() req,
  ) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    return this.commandBus.execute(
      new CreatePostByBlogCommand(blogId, dto, accessToken),
    );
  }

  @Put('blogs/:blogId/posts/:postId')
  @UseInterceptors(ChangePostByOtherUserInterceptor)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostByBlog(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdatePostByBlogDto,
    @Request() req,
  ) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    return this.commandBus.execute(
      new UpdatePostByBlogCommand(blogId, postId, dto, accessToken),
    );
  }

  @Delete('blogs/:blogId/posts/:postId')
  @UseInterceptors(ChangePostByOtherUserInterceptor)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostByBlog(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Request() req,
  ) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    return this.commandBus.execute(
      new DeletePostByBlogCommand(blogId, postId, accessToken),
    );
  }

  @Post('blogs')
  @UseGuards(JwtAuthGuard)
  async createBlog(
    @Body(
      new ValidationPipe({
        stopAtFirstError: true,
        transform: true,
        disableErrorMessages: false,
        always: true,
      }),
    )
    dto: CreateBloggerDto,
    @Request() req,
  ) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    return this.commandBus.execute(new CreateBlogCommand(dto, accessToken));
  }

  @Get('blogs')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getMyBlogs(@Query() dto: BlogsPaginationDto, @Request() req) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    return this.queryBus.execute(new GetAllBlogsCommand(dto, accessToken));
  }

  @Put('users/:id/ban')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async banUnbanUserByBlog(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() dto: BanUserByBlogDto,
    @Request() req,
  ) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    return this.queryBus.execute(
      new BanUnbanUserByBlogCommand(userId, dto, accessToken),
    );
  }
}
