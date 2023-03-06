import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUserByBlogDto } from '../dto/banUserByBlogDto';

export class BanUnbanUserByBloggerCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: BanUserByBlogDto,
    public readonly accessToken: string,
  ) {}
}

@CommandHandler(BanUnbanUserByBloggerCommand)
export class BanUnbanUserByBlogHandler
  implements ICommandHandler<BanUnbanUserByBloggerCommand>
{
  async execute(command: BanUnbanUserByBloggerCommand): Promise<any> {
    const { userId, dto, accessToken } = command;
    return Promise.resolve(undefined);
  }
}
