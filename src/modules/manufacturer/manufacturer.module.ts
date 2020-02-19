import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { manufacturerProviders } from './manufacturer.provider';
import { ManufacturerRepositoryMongo } from './manufacturer.repository.mongo';
import { ManufacturerRepositoryManager } from './manufacturer.repository.manager';
import { ManufacturerRepositorySql } from './manufacturer.repository.sql';

@Module({
    imports: [DbModule],
    providers: [...manufacturerProviders, ManufacturerRepositoryMongo, ManufacturerRepositorySql, ManufacturerRepositoryManager],
    exports: [...manufacturerProviders, ManufacturerRepositoryManager]
})
export class ManufacturerModule {}