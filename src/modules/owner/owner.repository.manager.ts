import { IRepositoryManager } from '../../declarations/interfaces/RepositoryManager.interface';
import { Databases } from '../../declarations/types/db.enum';
import { Injectable } from '@nestjs/common';
import { OwnerRepositorySql } from './owner.repository.sql';
import { OwnerRepositoryMongo } from './owner.repository.mongo';

@Injectable()
export class OwnerRepositoryManager implements IRepositoryManager<OwnerRepositorySql, OwnerRepositoryMongo> {
    private readonly ownerRepositorySql: OwnerRepositorySql;
    private readonly ownerRepositoryMongo: OwnerRepositoryMongo;

    constructor(ownerRepositorySql: OwnerRepositorySql, ownerRepositoryMongo: OwnerRepositoryMongo) {
        this.ownerRepositorySql = ownerRepositorySql;
        this.ownerRepositoryMongo = ownerRepositoryMongo;
    }

    public setRepo(db: Databases): OwnerRepositorySql | OwnerRepositoryMongo {
        switch(db) {
            case 'postgres':
                return this.ownerRepositorySql;
            case 'mongo':
                return this.ownerRepositoryMongo;
            default:
                throw new Error(`Unable to find database ${db} for Owner repository`);
        }
    }
}