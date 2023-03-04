import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Put,
    HttpCode,
    Query,
    UseGuards,
    UsePipes, ValidationPipe, UseInterceptors, ClassSerializerInterceptor, ParseUUIDPipe, ParseBoolPipe
} from '@nestjs/common';
import {BindBlogToUserDto} from "./dto/BindBlogToUserDto";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {BanUnbanUserDto} from "../users/dto/BanUnbanUserDto";
import {BanUnbanUserCommand} from "../users/useCase/banUnbanUserHandler";
import {CreateUserPaginatedDto} from "../users/dto/create.user.paginated.dto";
import {GetUsersCommand} from "../users/useCase/getUsersHandler";
import {BaseAuthGuard} from "../guards/base.auth.guard";
import {CreateUserDto} from "../users/dto/create.user.dto";
import {CreateUserCommand} from "../users/useCase/createUserHandler";
import {DeleteUserCommand} from "../users/useCase/deleteUserHandler";
import {BlogsPaginationDto} from "../bloggers/dto/blogsPaginationDto";
import {BindBlogToUserCommand} from "./useCase/bindBlogToUserHandler";
import {SkipThrottle} from "@nestjs/throttler";
import {SAGetAllBloggersCommand} from "./useCase/SAGetAllBloggersHandler";
import {SetBanToBlogCommand} from "./useCase/setBanToBlogHandler";

@SkipThrottle()
@Controller('sa')
export class SuperadminController {
    constructor(private readonly commandBus: CommandBus,
                private readonly queryBus: QueryBus) {
    }

    @Put('blogs/:id/ban')
    @UseGuards(BaseAuthGuard)
    @HttpCode(204)
    async setBanToBlog(@Param("id", ParseUUIDPipe) blogId: string,
                       @Body("isBanned", ParseBoolPipe) isBanned: boolean) {
        return this.commandBus.execute(new SetBanToBlogCommand(blogId, isBanned))
    }

    @Put('blogs/:id/bind-with-user/:userId')
    @UseGuards(BaseAuthGuard)
    @HttpCode(204)
    async bindBlogToUser(@Param() dto: BindBlogToUserDto) {
        return this.commandBus.execute(new BindBlogToUserCommand(dto.id, dto.userId))
    }

    @Get('blogs')
    @UseGuards(BaseAuthGuard)
    @HttpCode(200)
    async getAllBlogs(@Query() dto: BlogsPaginationDto) {
        return this.queryBus.execute(new SAGetAllBloggersCommand(dto))
    }

    @Put('users/:id/ban')
    @UseGuards(BaseAuthGuard)
    @HttpCode(204)
    async setBannedStatus(@Param('id', ParseUUIDPipe) userId: string,
                          @Body() dto: BanUnbanUserDto) {
        return this.commandBus.execute(new BanUnbanUserCommand(dto, userId))
    }

    @Get('users')
    @UseGuards(BaseAuthGuard)
    async getAllUsers(@Query() dto: CreateUserPaginatedDto) {
        return this.queryBus.execute(new GetUsersCommand(dto))
    }

    @Post('users')
    @UseGuards(BaseAuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.commandBus.execute(new CreateUserCommand(createUserDto))
    }

    @Delete('users/:id')
    @UseGuards(BaseAuthGuard)
    @HttpCode(204)
    async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.commandBus.execute(new DeleteUserCommand(id))
    }
}
