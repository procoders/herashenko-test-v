import { Injectable, Logger } from '@nestjs/common';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import { ConfigService } from '../config/config.service';

@Injectable()
export class DbService {
    private connection: Connection;
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    public async getConnection(): Promise<Connection> {
        return this.connection;
    }

    public async establishConnection(type: string, configs: object): Promise<Connection> {
        const env = this.configService.get('NODE_ENV');

        try {
            if (!env) throw new Error('Need to provide NODE_ENV');

            const dbName = `${env}_${type}`

            const options = Object.assign(await getConnectionOptions(dbName), configs);

            this.connection = await createConnection({ ...options });

            Logger.log(`✅ Database with name ${dbName} connection successfully established for "${env}" enviroment`, 'DbService');

            return this.connection;
        } catch (error) {

            throw new Error(`❌ Error connecting to the database for "${env}" enviroment. Details: ${error.message}`);
        }
    }

    public async closeConnection(): Promise<void> {
        this.connection.close();
    }
}