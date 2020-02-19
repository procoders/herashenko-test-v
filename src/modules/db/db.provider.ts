import { DbService } from './db.service';
import { Connection } from 'typeorm';
import { ConfigService } from '../config/config.service';

export const databaseProviders = [
     {
        provide: 'MONGODB_CONNECTION',
        useFactory: async (dbService: DbService, configService: ConfigService): Promise<Connection> =>
            dbService.establishConnection(configService.get('MONGO_NAME'), {
                url: configService.get('MONGO_URL'),
                useUnifiedTopology: true,
                name: 'default'
            }),
        inject: [DbService, ConfigService],
    },
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async (dbService: DbService, configService: ConfigService): Promise<Connection> =>
            dbService.establishConnection(configService.get('DB_NAME'), {
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                name: 'default'
            }),
        inject: [DbService, ConfigService],
    },
];
