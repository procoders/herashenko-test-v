import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { databaseProviders } from './db.provider';
import { DbService } from './db.service';

@Module({
    imports: [ConfigModule],
    providers: [...databaseProviders, DbService],
    exports: [...databaseProviders, DbService]
})
export class DbModule {}