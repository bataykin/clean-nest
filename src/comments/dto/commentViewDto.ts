import { LikeStatusEnum } from '../comment.schema';

export class CommentViewDto {
  id: string;

  content: string;

  createdAt: Date;

  likesInfo: {
    likesCount: number;
    disLikesCount: number;
    myStatus: LikeStatusEnum;
  };

  commentatorInfo: {
    userId: string;
    userLogin: string;
  };

  postInfo: {
    id: string;
    title: string;
    blogId: string;
    blogName: string;
  };
}
