import {OmitType, PartialType} from "@nestjs/mapped-types";
import {CreateBloggerDto} from "./create.blogger.dto";
import {CreatePostDto} from "../../posts/dto/create-post.dto";

export class CreatPostByBlogDto extends OmitType(CreatePostDto, ['blogId']){}