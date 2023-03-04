import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import {Inject, Injectable, Scope} from "@nestjs/common";
import {BlogEntity} from "../entities/blogEntity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {BlogsORM} from "../blogs.ORM";
import {IBlogsRepo, IBlogsRepoToken} from "../IBlogsRepo";

@ValidatorConstraint({async: true, name: "blogIdExists"})
@Injectable()
export class IsBlogExistConstraint implements ValidatorConstraintInterface {
    constructor( @Inject(IBlogsRepoToken)
                 private readonly blogsRepo: IBlogsRepo<BlogEntity>) {
    }

    async validate(blogId: string, args: ValidationArguments) {

        const blog =  await this.blogsRepo.findBlogById( blogId)

            if (!blog) return false;
            return true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return "blogId is not available"
    }
}

export function IsBlogExist(
                            uniqueField: string,
                            exceptField: string = null,
                            validationOptions?: ValidationOptions) {
    return function (object:  Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBlogExistConstraint,
            // async: true
        });
    };
}