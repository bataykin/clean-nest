import {IS_NOT_EMPTY_OBJECT, IsNotEmpty, IsNumber, IsString, MaxLength, Validate} from "class-validator";
import {IsBlogExist, IsBlogExistConstraint} from "../../bloggers/decorators/isBloggerExistsDecorator";
import {BlogEntity} from "../../bloggers/entities/blogEntity";
import {Transform, TransformFnParams} from "class-transformer";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(30)
    title: string

    @MaxLength(100)
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())

    shortDescription: string

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())

    @MaxLength(1000)
    content: string

    @IsString()
    // @IsBlogExist('blogId')
        @Validate(IsBlogExistConstraint )
    blogId: string


    blogName?: string

}
