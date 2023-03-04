import {FilterQuery} from "mongoose";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {PaginationCommentsDto} from "./dto/paginationCommentsDto";
import {CommentEntity} from "./entities/comment.entity";
import {BlogsPaginationDto} from "../bloggers/dto/blogsPaginationDto";
import {CommentViewDto} from "./dto/commentViewDto";

export const ICommentsRepoToken = Symbol('ICommentsRepoToken')

export interface ICommentsRepo<GenericCommentType> {
    createComment(comment: CreateCommentDto)

    findCommentById(commentId: string)

    getCommentsByPost(postId: string, dto: PaginationCommentsDto)

    updateComment(commentId: string, content: string)

    deleteComment(commentId: string)

    countComments(postId: string)

    getAllCommentByBlog(userId: string, dto: BlogsPaginationDto): Promise<CommentEntity[]>

    mapCommentsToResponse(allComments: CommentEntity[]): Promise<CommentViewDto[]>
}