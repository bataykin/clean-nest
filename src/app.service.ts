import {Injectable} from '@nestjs/common';
import {ConfigType, getConfiguration} from "./config/configuration";
import {ConfigService} from "@nestjs/config";
import {AuthConfigType} from "./auth/configuration/authConfiguration";
import {ICommandHandler} from "@nestjs/cqrs";

@Injectable()
export class AppService{
    constructor(private configService: ConfigService<ConfigType>,
                private authConfigService: ConfigService<AuthConfigType>) {
    }

    getHello(): any {
        // console.dir(this.configService.get('db', {infer: true}).mongo)
        return  'Hello World!'
        // {
        //     repoType: this.configService.get<string>('REPO_TYPE'),
        //     auth: this.authConfigService.get<AuthConfigType>('authorization'),
        //     repoSettings: this.configService.get<any>('db')
        // };
    }
}
