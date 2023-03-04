import {CreateUserDto} from "../dto/create.user.dto";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {BadRequestException, Inject} from "@nestjs/common";
import {ICommentsRepo, ICommentsRepoToken} from "../../comments/ICommentsRepo";
import {CommentEntity} from "../../comments/entities/comment.entity";
import {IUsersRepo, IUsersRepoToken} from "../IUsersRepo";
import {UserEntity} from "../entity/user.entity";
import {AuthUtilsClass} from "../../auth/auth.utils";
import { v4 as uuidv4 } from 'uuid';

export class CreateUserCommand {
    constructor(public readonly dto: CreateUserDto) {
    }
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand>{
    constructor(@Inject(IUsersRepoToken)
                private readonly usersRepo: IUsersRepo<UserEntity>,
                private readonly authUtils: AuthUtilsClass
    ) {
    }

    async execute(command: CreateUserCommand): Promise<any> {
        const {dto} = command
        const isCredentialsExists = await this.usersRepo.checkLoginEmailExists(dto.login, dto.email)
        if (isCredentialsExists) {
            throw new BadRequestException(isCredentialsExists)
        }
        const passwordHash = await this.authUtils._generateHash(dto.password)
        const code = uuidv4()
        const user = await this.usersRepo.createUser(dto.login, dto.email, passwordHash, code)
        // await this.usersRepo.confirmEmail(code)
        const result =  await this.usersRepo.mapUserEntityToResponse(user)
        return  result

    }

}