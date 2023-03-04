import { AppService } from '../app.service';
import { getAuthConfiguration } from '../auth/configuration/authConfiguration';
import { BlogEntity } from '../bloggers/entities/blogEntity';
import { TYPEORM_MODULE_OPTIONS } from '@nestjs/typeorm/dist/typeorm.constants';
import { DeviceEntity } from '../device/entities/device.entity';
import * as process from 'process';

export const getConfiguration = () => {
  // Hello: this.appService.getHello(),
  return {
    ENV: process.env.NODE_ENV,
    DB_TYPE: process.env.REPO_TYPE,
    MONGO_URI: process.env.MONGO_URI,

    db: {
      mongo: {
        uri: process.env.MONGO_URI,
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
        // datastore: 'postgresql-perpendicular-36302',
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: 5432,
        username: 'wwcbeelclztddp',
        password:
          'ccb0fd68cff34e8ba8d47ff32f0debfdb634071eeabe3e4d1f7d58fcfaec2de7',
        database: 'd6iat8dcidb74a',
        ssl: {
          rejectUnauthorized: false,
        },
        autoLoadEntities: true,
        synchronize: true,
        entities: [BlogEntity, DeviceEntity],
        logging: false,

        migrations: [
          /*...*/
        ],
      },
    },

    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    },

    // auth: getAuthConfiguration(),
  };
};

export type ConfigType = ReturnType<typeof getConfiguration> & {
  REPO_TYPE: string;
  NODE_ENV: 'production' | 'development' | 'testing';
};
