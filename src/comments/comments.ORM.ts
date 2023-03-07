import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { ICommentsRepo } from './ICommentsRepo';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationCommentsDto } from './dto/paginationCommentsDto';
import { BlogsPaginationDto } from '../bloggers/dto/blogsPaginationDto';
import { CommentViewDto } from './dto/commentViewDto';
import { LikeEntity } from '../likes/entities/like.entity';

export class CommentsORM
  extends Repository<CommentEntity>
  implements ICommentsRepo<CommentEntity>
{
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepo: Repository<CommentEntity>,
  ) {
    super(CommentEntity, commentsRepo.manager, commentsRepo.queryRunner);
  }

  async getAllCommentByBlog(
    userId: string,
    dto: BlogsPaginationDto,
  ): Promise<CommentEntity[]> {
    console.log(userId);
    let comments = await this.commentsRepo
      .createQueryBuilder('comments')
      .leftJoin('comments.user', 'users')
      .leftJoin('users.blogs', 'blogs')
      .where('blogs.userId = :userId', { userId })
      .andWhere('users.isBanned = false')
      .skip(dto.skipSize)
      .take(dto.pageSize)
      .orderBy(
        'comments.' + dto.sortBy,
        dto.sortDirection === 'asc' ? 'ASC' : 'DESC',
        'NULLS LAST',
      )
      .getMany();
    return comments;
  }

  async mapCommentsToResponse(
    allComments: CommentEntity[],
  ): Promise<CommentViewDto[]> {
    const result = [];
    let res: CommentViewDto;
    for await (let comment of allComments) {
      let { id, content, createdAt, userId, userLogin, postId } = comment;
      let likes = await this.manager
        .createQueryBuilder()
        .select()
        .from(LikeEntity, 'l')
        .leftJoin('users', 'u', 'l.userId = u.id')
        .addSelect(
          `
            COALESCE( SUM( CASE
                    WHEN l.reaction = 'Dislike' THEN 1
                    ELSE 0 END ), 0 )   
            `,
          'dislikesCount',
        )
        .addSelect(
          `
            COALESCE( SUM( CASE
                WHEN l.reaction = 'Like' THEN 1
                ELSE 0 END ), 0)
            `,
          'likesCount',
        )
        .where('l.commentId = :commentId', { id })
        .andWhere('u.isBanned = false')
        .getRawOne();
    }
    return Promise.resolve([]);
  }

  async createComment(comment: CreateCommentDto) {
    const comm = new CommentEntity();
    comm.content = comment.content;
    comm.postId = comment.postId;
    comm.userLogin = comment.userLogin;
    comm.userId = comment.userId;
    await this.commentsRepo.manager.save(comm);
    return comm;
  }

  async findCommentById(commentId: string): Promise<CommentEntity | null> {
    return await this.commentsRepo.findOneBy({
      id: commentId,
      user: {
        isBanned: false,
      },
    });
  }

  async getCommentsByPost(postId, dto: PaginationCommentsDto) {
    let comments = await this.commentsRepo
      .createQueryBuilder('comments')
      .leftJoin('comments.user', 'users')
      .where('comments.postId = :postId', { postId: postId })
      .andWhere('users.isBanned = false')
      .skip(dto.skipSize)
      .take(dto.pageSize)
      .orderBy(
        'comments.' + dto.sortBy,
        dto.sortDirection === 'asc' ? 'ASC' : 'DESC',
        'NULLS LAST',
      )
      .getMany();
    return comments;
    // const result = await this.commentsRepo.find({
    //     where: {postId: postId},
    //     skip: dto.skipSize,
    //     take: dto.pageSize,
    //     order: {  }
    //
    // })
    // return result
  }

  async updateComment(commentId: string, content: string) {
    return await this.commentsRepo.update(
      { id: commentId },
      { content: content },
    );
  }

  async deleteComment(commentId: string) {
    return await this.commentsRepo.delete(commentId);
  }

  async countComments(commentId: string) {
    return await this.commentsRepo.count({
      where: {
        postId: commentId,
        user: {
          isBanned: false,
        },
      },
    });
  }
}
