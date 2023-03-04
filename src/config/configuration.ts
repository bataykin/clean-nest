import {AppService} from "../app.service";
import {getAuthConfiguration} from "../auth/configuration/authConfiguration";
import {BlogEntity} from "../bloggers/entities/blogEntity";
import {TYPEORM_MODULE_OPTIONS} from "@nestjs/typeorm/dist/typeorm.constants";
import {DeviceEntity} from "../device/entities/device.entity";

export const getConfiguration = () => {

    // Hello: this.appService.getHello(),
    return {
        ENV: process.env.NODE_ENV,
        DB_TYPE: process.env.REPO_TYPE,
        MONGO_URI: process.env.MONGO_URI,

        db: {

            mongo: {
                uri: process.env.MONGO_URI
            },

            sql: {
                // datastore: 'postgresql-reticulated-47709',
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: '1984',
                database: 'TestBase',
                // ssl: {
                //     rejectUnauthorized: false
                //
                // },
                autoLoadEntities: true,
                synchronize: true,
                logging: false,
            },

            orm: {
                // datastore: 'postgresql-rugged-65282',
                type: 'postgres',
                host: 'ep-ancient-glitter-789038.ap-southeast-1.aws.neon.tech',
                port: 5432,
                username: 'bataykin',
                password: 'yp3vLnPQ6mhb',
                database: 'neondb',
                ssl: {
                    rejectUnauthorized: false
                },
                autoLoadEntities: true,
                synchronize: true,
                entities: [BlogEntity, DeviceEntity],
                logging: false,


                migrations: [/*...*/],


            }
        },

        port: parseInt(process.env.PORT, 10) || 3000,
        database: {
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT, 10) || 5432
        },

        // auth: getAuthConfiguration(),

    }
}

export type ConfigType = ReturnType<typeof getConfiguration> & {
    REPO_TYPE:string,
    NODE_ENV: 'production' | 'development' | 'testing'
}