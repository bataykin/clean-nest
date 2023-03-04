import {
    Body,
    Controller, Delete,
    Get,
    HttpCode,
    HttpStatus, Param,
    ParseIntPipe, Post, Put,
    Query,
    Res, UseFilters, UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {UsersMongoService} from "./oldServiceRepos/users.Mongo.service";
import {response} from "express";
import {CreateUserPaginatedDto} from "./dto/create.user.paginated.dto";
import {CreateUserDto} from "./dto/create.user.dto";
import {HttpExceptionFilter} from "../http-exception.filter";
import {Schema, Types} from "mongoose";
import {BaseAuthGuard} from "../guards/base.auth.guard";
import {UsersSQLService} from "./oldServiceRepos/users.SQL.service";
import {AUserService} from "./oldServiceRepos/IUserService";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {CreateUserCommand, CreateUserHandler} from "./useCase/createUserHandler";
import {GetAllPostsCommand} from "../posts/useCase/getAllPostsHandler";
import {GetUsersCommand} from "./useCase/getUsersHandler";
import {DeleteUserCommand} from "./useCase/deleteUserHandler";
import {BanUnbanUserDto} from "./dto/BanUnbanUserDto";
import {BanUnbanUserCommand} from "./useCase/banUnbanUserHandler";


@Controller('users')
export class UsersController {

    constructor(private readonly commandBus: CommandBus,
                private readonly queryBus: QueryBus) {
    }

    // @UseGuards(BaseAuthGuard)
    // @Put(':id/ban')
    // async setBannedStatus (@Param('id') userId: string,
    //                        @Body() dto: BanUnbanUserDto){
    //     return this.commandBus.execute(new BanUnbanUserCommand(dto, userId))
    //
    // }


    //  QUERY  Returns all users paginated
    //
    // @HttpCode(200)
    // @Get()
    // async getAll(@Query() dto: CreateUserPaginatedDto) {
    //     return this.queryBus.execute(new GetUsersCommand(dto))
    // }


    //  COMMAND  Create new user
    //
    // @Post()
    // @UseGuards(BaseAuthGuard)
    // @UsePipes(new ValidationPipe({ transform: true }))
    // async create(@Body() createUserDto: CreateUserDto) {
    //     return this.commandBus.execute(new CreateUserCommand(createUserDto))
    // }

    //  COMMAND Delete user by id
    //
    // @HttpCode(204)
    // @Delete(':id')
    // @UseGuards(BaseAuthGuard)
    // async delete(@Param('id') id: string) {
    //     return this.commandBus.execute(new DeleteUSerCommand(id))
    // }
}
