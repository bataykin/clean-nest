import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { IBlogsRepo, IBlogsRepoToken } from '../IBlogsRepo';
import { BlogEntity } from '../entities/blogEntity';

export class FindBlogCommand {
  constructor(public readonly blogId: string) {}
}

@QueryHandler(FindBlogCommand)
export class FindBlogHandler implements IQueryHandler<FindBlogCommand> {
  constructor(
    @Inject(IBlogsRepoToken)
    private readonly blogsRepo: IBlogsRepo<BlogEntity>,
  ) {}
  async execute(query: FindBlogCommand): Promise<any> {
    const { blogId } = query;
    const blog = await this.blogsRepo.findBlogById(blogId);
    if (!blog) {
      throw new NotFoundException('net takogo blogId');
    }
    const result = await this.blogsRepo.mapBlogToResponse(
      blog,
      'id',
      'name',
      'websiteUrl',
      'createdAt',
    );
    return Promise.resolve(result);
  }
}
