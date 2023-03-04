import {BlogService} from "../bloggers/blog.service";
import {Inject, Injectable} from "@nestjs/common";
import {PostService} from "../posts/post.service";
import {IBlogsRepo, IBlogsRepoToken} from "../bloggers/IBlogsRepo";
import {BlogEntity} from "../bloggers/entities/blogEntity";
import {CreatePostDto} from "../posts/dto/create-post.dto";

@Injectable()
export class BlogPostService {
    constructor(
        private readonly blogService: BlogService,
        private readonly postService: PostService,
    ) {
    }

    async getBlogNameById(id: string){
        return await this.blogService.getBlogNameById(id)
    }
}