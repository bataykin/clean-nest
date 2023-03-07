import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BannedUsersEntity } from './entities/bannedUsersEntity';
import { IBannedUsersRepo } from './IBannedUsersRepo';
import { BanUserByBlogDto } from './dto/banUserByBlogDto';

export class BannedUsersORM
  extends Repository<BannedUsersEntity>
  implements IBannedUsersRepo<BannedUsersEntity>
{
  constructor(
    @InjectRepository(BannedUsersEntity)
    private readonly bannedUsersRepo: Repository<BannedUsersEntity>,
  ) {
    super(
      BannedUsersEntity,
      bannedUsersRepo.manager,
      bannedUsersRepo.queryRunner,
    );
  }

  async setBanStatus(userId: string, dto: BanUserByBlogDto): Promise<void> {
    const bannedUser = {
      userId: userId,
      blogId: dto.blogId,
      isBanned: dto.isBanned,
      banReason: dto.isBanned ? dto.banReason : null,
      banDate: dto.isBanned ? new Date() : null,
    };
    const wasBannedInThisBlog = await this.getBannedUserById(
      userId,
      dto.blogId,
    );
    if (!wasBannedInThisBlog)
      if (dto.isBanned) {
        const res = await this.bannedUsersRepo.insert(bannedUser);
        return;
      } else {
        const res = await this.bannedUsersRepo.update(
          { userId: userId, blogId: dto.blogId },
          {
            isBanned: dto.isBanned,
            banReason: dto.isBanned ? dto.banReason : null,
            banDate: dto.isBanned ? new Date() : null,
          },
        );
        return;
      }
  }

  async getBannedUserById(
    userId: string,
    blogId: string,
  ): Promise<BannedUsersEntity | null> {
    return await this.bannedUsersRepo.findOneBy({ userId, blogId });
  }
}
