import {
    HttpException,
    Injectable,
    NestMiddleware,
    NotFoundException,
    Scope,
    UnauthorizedException
} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import {PostsMongoRepo} from "../posts/oldServicesRepos/posts.Mongo.repo";
import mongoose from "mongoose";
import {CommentsMongoRepo} from "../comments/oldServiceRepos/comments.Mongo.repo";

@Injectable()
export class CommentsCheckUriBeforeBodyMiddleware implements NestMiddleware {

    constructor() {
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const fullUrl = req.baseUrl + req.path
        const restUrl = fullUrl.split('/')
        if ((restUrl[1] === 'comments') && (restUrl[3] === 'like-status')) {
            if (!mongoose.Types.ObjectId.isValid(restUrl[2]) && (typeof restUrl[2] != "string")) {
                throw new NotFoundException('net takogo comments')
            }

        }


        next();
    }
}

