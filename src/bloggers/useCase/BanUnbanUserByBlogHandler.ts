import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUserByBlogDto } from '../dto/banUserByBlogDto';
import { Inject } from '@nestjs/common';
import { IUsersRepo, IUsersRepoToken } from '../../users/IUsersRepo';
import { UserEntity } from '../../users/entity/user.entity';
import { IBlogsRepo, IBlogsRepoToken } from '../IBlogsRepo';
import { BlogEntity } from '../entities/blogEntity';
import { AuthService } from '../../auth/authService';
import { BannedUsersEntity } from '../entities/bannedUsersEntity';
import { IBannedUsersRepo, IBannedUsersRepoToken } from '../IBannedUsersRepo';

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
  constructor(
    private readonly authService: AuthService,
    @Inject(IUsersRepoToken)
    private readonly usersRepo: IUsersRepo<UserEntity>,
    @Inject(IBlogsRepoToken)
    private readonly blogsRepo: IBlogsRepo<BlogEntity>,
    @Inject(IBannedUsersRepoToken)
    private readonly bannedUsersRepo: IBannedUsersRepo<BannedUsersEntity>,
  ) {}
  async execute(command: BanUnbanUserByBloggerCommand): Promise<any> {
    const { userId, dto, accessToken } = command;
    await this.bannedUsersRepo.setBanStatus(userId, dto);
    return Promise.resolve(undefined);
  }
}
