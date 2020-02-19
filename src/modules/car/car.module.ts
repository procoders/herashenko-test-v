import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { carProviders } from './car.provider';
import { OwnerModule } from '../owner/owner.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';
import { CarRepositoryMongo } from './car.repository.mongo';
import { CarRepositorySql } from './car.repository.sql';
import { CarRepositoryManager } from './car.repository.manager';

@Module({
    imports: [DbModule, OwnerModule, ManufacturerModule],
    providers: [...carProviders, CarRepositoryMongo, CarRepositorySql, CarRepositoryManager],
    exports: [CarRepositoryManager]
})
export class CarModule {}