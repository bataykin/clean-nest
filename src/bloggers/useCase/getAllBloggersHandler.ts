import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsPaginationDto } from '../dto/blogsPaginationDto';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { IBlogsRepo, IBlogsRepoToken } from '../IBlogsRepo';
import { BlogEntity } from '../entities/blogEntity';
import { AuthService } from '../../auth/authService';
import { IUsersRepo, IUsersRepoToken } from '../../users/IUsersRepo';
import { UserEntity } from '../../users/entity/user.entity';

export class GetAllBlogsCommand {
  constructor(
    public readonly dto: BlogsPaginationDto,
    public readonly accessToken: string,
  ) {}
}

@QueryHandler(GetAllBlogsCommand)
export class GetAllBloggersHandler
  implements IQueryHandler<GetAllBlogsCommand>
{
  constructor(
    @Inject(IBlogsRepoToken)
    private readonly blogsRepo: IBlogsRepo<BlogEntity>,
    private readonly authService: AuthService,
    @Inject(IUsersRepoToken)
    private readonly usersRepo: IUsersRepo<UserEntity>,
  ) {}

  async execute(query: GetAllBlogsCommand): Promise<any> {
    const { dto, accessToken } = query;
    const retrievedUserFromToken = accessToken
      ? await this.authService.retrieveUser(accessToken)
      : undefined;
    const userIdFromToken = retrievedUserFromToken
      ? retrievedUserFromToken.userId
      : undefined;
    const isBanned = await this.usersRepo.getBanStatus(userIdFromToken);
    if (isBanned) throw new UnauthorizedException('user is banned, sorry))');

    const {
      searchNameTerm = '',
      pageNumber = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      skipSize = +pageNumber > 1 ? +pageSize * (+pageNumber - 1) : 0,
    } = query.dto;
    const blogsPaginationBLLdto = {
      searchNameTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      skipSize,
    };

    const blogs = await this.blogsRepo.getUsersBlogsPaginated(
      blogsPaginationBLLdto,
      userIdFromToken,
    );
    // const blogs = await this.blogsRepo.getBlogsPaginated(blogsPaginationBLLdto)
    // const mappedBlogs = await this.blogsRepo.mapBlogsWithOwnersToResponse(blogs)
    const mappedBlogs = await this.blogsRepo.mapBlogsToResponse(
      blogs,
      'id',
      'name',
      'websiteUrl',
      'createdAt',
    );
    const docCount = await this.blogsRepo.countUsersBlogsBySearchname(
      searchNameTerm,
      userIdFromToken,
    );
    const result = {
      pagesCount: Math.ceil(docCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: docCount,
      items: mappedBlogs,
    };
    return result;
  }
}
