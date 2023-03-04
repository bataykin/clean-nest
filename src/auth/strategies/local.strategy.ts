
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {AuthMongoService} from "../oldServiceRepos/auth.Mongo.service";
import {AuthSQLService} from "../oldServiceRepos/auth.SQL.service";
import {AuthService} from "../authService";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'login',
        });
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException('net takogo usera');
        }
        return user;
    }
}