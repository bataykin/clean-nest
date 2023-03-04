import {Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersMongoService} from './oldServiceRepos/users.Mongo.service';
import {getModelToken, MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./user.schema";
import {AuthUtilsClass} from "../auth/auth.utils";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entity/user.entity";
import {UsersSQLService} from "./oldServiceRepos/users.SQL.service";
import {UsersSQLRepo} from "./oldServiceRepos/users.SQL.repo";
import {ABloggersService} from "../bloggers/oldServicesRepos/IBloggerService";
import {AUserService} from "./oldServiceRepos/IUserService";
import {BloggersMongoService} from "../bloggers/oldServicesRepos/bloggers.Mongo.service";
import {BloggersSQLService} from "../bloggers/oldServicesRepos/bloggers.SQL.service";
import {BloggersORMService} from "../bloggers/oldServicesRepos/bloggers.ORM.service";
import {UsersORMService} from "./oldServiceRepos/users.ORM.service";
import {UsersORMRepo} from "./oldServiceRepos/users.ORM.repo";
import {UsersMongoRepo} from "./oldServiceRepos/users.Mongo.repo";
import {IBlogsRepoToken} from "../bloggers/IBlogsRepo";
import {useRepositoryClassGeneric} from "../common/useRepositoryClassGeneric";
import {BlogsORM} from "../bloggers/blogs.ORM";
import {IUsersRepoToken} from "./IUsersRepo";
import {UsersORM} from "./users.ORM";
import {CqrsModule} from "@nestjs/cqrs";
import {CreateUserHandler} from "./useCase/createUserHandler";
import {GetUsersCommand, GetUsersHandler} from "./useCase/getUsersHandler";
import {DeleteUserHandler} from "./useCase/deleteUserHandler";
import {BanUnbanUserHandler} from "./useCase/banUnbanUserHandler";
import {IDevicesRepoToken} from "../device/IDevicesRepo";
import {DevicesORM} from "../device/devices.ORM";
import {DeviceEntity} from "../device/entities/device.entity";

const useUserServiceClass = () => {
    if (process.env.REPO_TYPE === 'MONGO') {
        return UsersMongoService
    } else if (process.env.REPO_TYPE === 'SQL') {
        return UsersSQLService
    } else if (process.env.REPO_TYPE === 'ORM') {
        return UsersORMService
    } else return UsersORMService // by DEFAULT if not in enum
}

const usersRouteHandlers = [
    CreateUserHandler,
    GetUsersHandler,
    DeleteUserHandler,
    BanUnbanUserHandler,
]

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([UserEntity, DeviceEntity]),

        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        // TypeOrmModule.forFeature([UserEntity])
    ],

    controllers: [UsersController],


    providers: [
        ...usersRouteHandlers,
        AuthUtilsClass,

        {
            provide: IUsersRepoToken,
            useClass: useRepositoryClassGeneric(UsersORM, UsersORM, UsersORM)
        },
        {
            provide: IDevicesRepoToken,
            useClass: useRepositoryClassGeneric(DevicesORM, DevicesORM, DevicesORM)
        },

        // {
        //     provide: AUserService,
        //     useClass: useUserServiceClass()
        // },
        //
        // UsersORMService,
        // UsersORMRepo,
        //
        // UsersSQLService,
        // UsersSQLRepo,
        //
        //
        // UsersMongoService,
        // {
        //     provide: UsersMongoRepo,
        //     useClass: UsersMongoRepo
        // },
        // UsersMongoRepo,
        // {
        //     provide: getModelToken(User.name),
        //     useValue: userModel,
        // },
    ],
    exports: [
        // UsersMongoRepo,
        // UsersSQLService,
        // UsersSQLRepo,
        //
        // UsersORMService,
        // UsersORMRepo,
        // TypeOrmModule
    ]
})
export class UsersModule {
}
