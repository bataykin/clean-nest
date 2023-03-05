import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IBlogsRepo, IBlogsRepoToken } from '../../bloggers/IBlogsRepo';
import { BlogEntity } from '../../bloggers/entities/blogEntity';

export class SA_SetBanToBlogCommand {
  constructor(
    public readonly blogId: string,
    public readonly isBanned: boolean,
  ) {}
}

@CommandHandler(SA_SetBanToBlogCommand)
export class SetBanToBlogHandler
  implements ICommandHandler<SA_SetBanToBlogCommand>
{
  constructor(
    @Inject(IBlogsRepoToken)
    private readonly blogsRepo: IBlogsRepo<BlogEntity>,
  ) {}
  async execute(command: SA_SetBanToBlogCommand): Promise<any> {
    const { blogId, isBanned } = command;
    await this.blogsRepo.setBanStatus(blogId, isBanned);
  }
}
