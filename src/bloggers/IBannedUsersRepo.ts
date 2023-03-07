import { CreateBloggerDto } from './dto/create.blogger.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogsPaginationDto } from './dto/blogsPaginationDto';
import { BlogEntity } from './entities/blogEntity';
import { BanUserByBlogDto } from './dto/banUserByBlogDto';

export const IBannedUsersRepoToken = Symbol('IBannedUsersRepoToken');

export interface IBannedUsersRepo<GenericBannedUserType> {
  setBanStatus(userId: string, dto: BanUserByBlogDto): void;
}
