import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseEnumPipe, ParseUUIDPipe,
    Post,
    Put,
    Query,
    Request, UseFilters,
    UseGuards, UsePipes, ValidationError, ValidationPipe
} from '@nestjs/common';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {PaginationPostsDto} from "./dto/pagination.posts.dto";
import {BaseAuthGuard} from "../guards/base.auth.guard";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {AuthMongoService} from "../auth/oldServiceRepos/auth.Mongo.service";
import {LikeStatusEnum} from "../comments/comment.schema";
import {CommentsSQLService} from "../comments/oldServiceRepos/comments.SQL.service";
import {APostService} from "./oldServicesRepos/IPostService";
import {AAuthService} from "../auth/oldServiceRepos/IAuthService";
import {ACommentService} from "../comments/oldServiceRepos/ICommentService";
import {PostService} from "./post.service";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {SayHelloCommand, SayHelloHandler} from "./useCase/sayHelloHandler";
import {GetAllPostsCommand} from "./useCase/getAllPostsHandler";
import {CreatePostCommand} from "./useCase/createPostHandler";
import {FindPostByIdCommand} from "./useCase/findPostByIdHandler";
import {UpdateBlogCommand} from "./useCase/updatePostHandler";
import {RemovePostCommand} from "./useCase/removePostHandler";
import {GetCommentsByPostCommand} from "./useCase/getCommentsByPostHandler";
import {CreateCommentByPostCommand} from "./useCase/createCommentByPostHandler";
import {SetLikeToPostCommand} from "./useCase/setLikeToPostHandler";
import {ContentDto} from "../comments/dto/contentDto";

@Controller('posts')
export class PostsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {
    }


    //  COMMENT-related query
    //  QUERY  Returns comments for specific post
    //
    @Get(':postId/comments')
    async getCommentsByPost(@Param('postId') postId: string, @Query() dto: PaginationPostsDto,
                            @Request() req) {
        await this.findPostById(postId, req)
        const accessToken = req.headers.authorization?.split(' ')[1]
        return this.queryBus.execute(new GetCommentsByPostCommand(postId, dto, accessToken))

    }


    //  COMMENT-related command
    //  COMMAND  Create new comment for specific post
    //
    @UseGuards(JwtAuthGuard)
    @Post(':postId/comments')
    async createCommentByPost(@Param('postId', ParseUUIDPipe) postId: string,
                              @Body() dto: ContentDto,
                              @Request() req) {
        await this.findPostById(postId, req)
        const accessToken = req.headers.authorization?.split(' ')[1]
        return this.commandBus.execute(new CreateCommentByPostCommand(postId, dto.content, accessToken))
        // await this.postsService.findPostById(postId)
        // const token = req.headers.authorization.split(' ')[1]
        // const retrievedUserFromToken = await this.authService.retrieveUser(token)
        // const userId = retrievedUserFromToken.sub
        // const login = retrievedUserFromToken.username
        // return this.commentsService.createCommentByPost(login, userId, postId, content)
    }


    //  QUERY  Returns posts with paging
    //
    @Get()
    @HttpCode(200)
    async getAll(@Query() paginationDto: PaginationPostsDto,
                 @Request() req) {
        const accessToken = req.headers.authorization?.split(' ')[1]
        return this.queryBus.execute(new GetAllPostsCommand(paginationDto, accessToken))
        // if (req.headers.authorization) {
        //     const token = req.headers.authorization.split(' ')[1]
        //     const retrievedUserFromToken = await this.authService.retrieveUser(token)
        //     const userId = retrievedUserFromToken.sub
        //     const posts = await this.postsService.findAll(paginationDto, userId);
        //     return posts
        // } else
        //     return this.postsService.findAll(paginationDto);
    }


    //  COMMAND  Create new post
    //
    @UseGuards(BaseAuthGuard)
    @Post()
    create(@Body() dto: CreatePostDto) {
        return this.commandBus.execute(new CreatePostCommand(dto))
    }


    //  QUERY  Returns post by Id
    //
    @Get(':id')
    // @UseGuards(JwtAuthGuard)
    async findPostById(@Param('id', ParseUUIDPipe) postId: string,
                       @Request() req) {
        const accessToken = req.headers.authorization?.split(' ')[1]
        return this.queryBus.execute(new FindPostByIdCommand(postId, accessToken))
        // if (req.headers.authorization) {
        //     const token = req.headers.authorization.split(' ')[1]
        //     const retrievedUserFromToken = await this.authService.retrieveUser(token)
        //
        //     const userId = retrievedUserFromToken.sub
        //     const login = retrievedUserFromToken.username
        //     const post = await this.postsService.findPostById(postId, userId);
        //     return post
        // } else
        //     return await this.postsService.findPostById(postId)
    }


    //  COMMAND  Update existing post by Id with InputModel
    //
    @HttpCode(204)
    @UseGuards(BaseAuthGuard)
    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePostDto) {
        return this.commandBus.execute(new UpdateBlogCommand(id, dto))
        // return this.postsService.update(id, dto);
    }


    //  COMMAND  Delete post specified by Id
    //
    @HttpCode(204)
    @UseGuards(BaseAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.commandBus.execute(new RemovePostCommand(id))
        // return this.postsService.remove(id);
    }


    //
    //NOT REQUIRED ENDPOINT IN SWAGGER 09
    //
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    @Put(':postId/like-status')
    async setLikeStatus(@Param('postId') postId: string,
                        @Body('likeStatus',
                            new ParseEnumPipe(LikeStatusEnum,
                                {
                                    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
                                    exceptionFactory: error => {
                                        throw new BadRequestException({
                                            message: 'likeStatus ' + error,
                                            field: "likeStatus"
                                        })
                                    }
                                }))
                            likeStatus: LikeStatusEnum,
                        @Request() req) {
        await this.findPostById(postId, req)
        const accessToken = req.headers.authorization?.split(' ')[1]
        return this.commandBus.execute(new SetLikeToPostCommand(postId, likeStatus, accessToken))
        // await this.postsService.findPostById(postId)
        // const token = req.headers.authorization.split(' ')[1]
        // const retrievedUserFromToken = await this.authService.retrieveUser(token)
        //
        // const userId = retrievedUserFromToken.sub
        // const login = retrievedUserFromToken.username
        //
        // return this.postsService.setLikeStatus(userId, postId, likeStatus)
    }


}
