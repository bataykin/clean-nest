import {HttpException, Inject, Injectable, Ip, NestMiddleware, Scope, UnauthorizedException} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import {RequestRepoClass} from "../auth/reuest.repo";
import {HttpErrorByCode} from "@nestjs/common/utils/http-error-by-code.util";
import {IRequestRepo, IRequestRepoToken} from "../auth/IRequestRepo";
import {RequestEntity} from "../auth/entities/request.entity";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

    constructor(@Inject(IRequestRepoToken)
                private readonly requestsRepo: IRequestRepo<RequestEntity>,) {
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const ip = req.headers['x-forwarded-for'] ||

            req.socket.remoteAddress

        // console.log(ip)

        const parseIp = (req) =>
            req.headers['x-forwarded-for']?.split(',').shift()
            || req.socket?.remoteAddress
        // console.log(parseIp(req))
        const trueDate = new Date()
        const fullUrl = req.baseUrl + req.path
        const attemptsCount: number = await this.requestsRepo.getAttempts(
            parseIp(req), 10, trueDate, fullUrl)
        await this.requestsRepo.addRequest(parseIp(req), trueDate, fullUrl)
        if (attemptsCount > 5) {
            throw new HttpException('too many request from YOU! (by LoggerMiddleware)', 429)
        }
        next();
    }
}

