import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Inject} from "@nestjs/common";
import {IBlogsRepo, IBlogsRepoToken} from "../../bloggers/IBlogsRepo";
import {BlogEntity} from "../../bloggers/entities/blogEntity";

export class BindBlogToUserCommand {
    constructor(
        public readonly id: string,
        public readonly userId: string
    ) {
    }

}

@CommandHandler(BindBlogToUserCommand)
export class BindBlogToUserHandler implements ICommandHandler<BindBlogToUserCommand>{
    constructor(@Inject(IBlogsRepoToken)
                private readonly blogsRepo: IBlogsRepo<BlogEntity>) {
    }
    async execute(command: BindBlogToUserCommand): Promise<any> {
        const {userId, id} = command
        // console.log('blogId is ', id, ' userId is ', userId)
        await this.blogsRepo.bindBlogToUser(id, userId)
        return Promise.resolve('implement BindBlogToUserCommand');
    }

}