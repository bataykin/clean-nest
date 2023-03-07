import { BlogsPaginationDto } from '../dto/blogsPaginationDto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuthService } from '../../auth/authService';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { IUsersRepo, IUsersRepoToken } from '../../users/IUsersRepo';
import { UserEntity } from '../../users/entity/user.entity';
import { IBlogsRepo, IBlogsRepoToken } from '../IBlogsRepo';
import { BlogEntity } from '../entities/blogEntity';
import { IBannedUsersRepo, IBannedUsersRepoToken } from '../IBannedUsersRepo';
import { BannedUsersEntity } from '../entities/bannedUsersEntity';

export class GetBannedUsersForBlogQuery {
  constructor(
    public readonly blogId: string,
    public readonly dto: BlogsPaginationDto,
    public readonly accessToken: string,
  ) {}
}

@QueryHandler(GetBannedUsersForBlogQuery)
export class GetBannedUsersForBlogHandler
  implements IQueryHandler<GetBannedUsersForBlogQuery>
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
  async execute(query: GetBannedUsersForBlogQuery): Promise<any> {
    const { dto, blogId, accessToken } = query;
    const retrievedUserFromToken = await this.authService.retrieveUser(
      accessToken,
    );
    const userIdFromToken = retrievedUserFromToken.userId;
    const isUserExist = await this.usersRepo.findById(userIdFromToken);
    if (!isUserExist) {
      throw new UnauthorizedException('unexpected user');
    }
    const {
      searchNameTerm = '',
      pageNumber = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      skipSize = +pageNumber > 1 ? +pageSize * (+pageNumber - 1) : 0,
    } = dto;
    const usersPaginationBLLdto = {
      searchNameTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      skipSize,
    };
    const bannedUsers =
      await this.bannedUsersRepo.getBannedUsersForBlogPaginated(
        blogId,
        usersPaginationBLLdto,
      );
    const mappedUsers = await this.bannedUsersRepo.mapArrayOfBannedUserEntity(
      bannedUsers,
    );

    const docCount = await this.bannedUsersRepo.countBannedUsersBySearchName(
      usersPaginationBLLdto.searchNameTerm,
    );
    return {
      pagesCount: Math.ceil(docCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: docCount,
      items: mappedUsers,
    };
  }
}
