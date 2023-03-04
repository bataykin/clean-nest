import {IsNotEmpty, IsString, IsUrl, MaxLength} from "class-validator";
import {Transform, TransformFnParams} from "class-transformer";

export class CreateBloggerDto {
    // @IsString()
    @MaxLength(15)
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    name: string

    @IsUrl({stopAtFirstError:true })
    @MaxLength(100, )
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    youtubeUrl: string
}
