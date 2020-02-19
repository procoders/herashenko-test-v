import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { ownerProviders } from './owner.provider';
import { OwnerRepositoryMongo } from './owner.repository.mongo';
import { OwnerRepositorySql } from './owner.repository.sql';
import { OwnerRepositoryManager } from './owner.repository.manager';

@Module({
    imports: [DbModule],
    providers: [...ownerProviders, OwnerRepositoryMongo, OwnerRepositorySql, OwnerRepositoryManager],
    exports: [...ownerProviders, OwnerRepositoryManager]
})
export class OwnerModule {}