import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {BanUserByBlogDto} from "../dto/banUserByBlogDto";

export class BanUnbanUserByBlogCommand {
    constructor(public readonly userId: string,
                public readonly dto:BanUserByBlogDto,
                public readonly accessToken: string) {
    }
}

@CommandHandler(BanUnbanUserByBlogCommand)
export class BanUnbanUserByBlogHandler implements ICommandHandler<BanUnbanUserByBlogCommand>{
    async execute(command: BanUnbanUserByBlogCommand): Promise<any> {
        const {userId, dto,accessToken} = command
        return Promise.resolve(undefined);
    }
}