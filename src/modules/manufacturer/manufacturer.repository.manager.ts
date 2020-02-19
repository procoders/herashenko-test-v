import { IRepositoryManager } from '../../declarations/interfaces/RepositoryManager.interface';
import { Databases } from '../../declarations/types/db.enum';
import { Injectable } from '@nestjs/common';
import { ManufacturerRepositorySql } from './manufacturer.repository.sql';
import { ManufacturerRepositoryMongo } from './manufacturer.repository.mongo';

@Injectable()
export class ManufacturerRepositoryManager implements IRepositoryManager<ManufacturerRepositorySql, ManufacturerRepositoryMongo> {
    private readonly manufacturerRepositorySql: ManufacturerRepositorySql;
    private readonly manufacturerRepositoryMongo: ManufacturerRepositoryMongo;

    constructor(manufacturerRepositorySql: ManufacturerRepositorySql, manufacturerRepositoryMongo: ManufacturerRepositoryMongo) {
        this.manufacturerRepositorySql = manufacturerRepositorySql;
        this.manufacturerRepositoryMongo = manufacturerRepositoryMongo;
    }

    public setRepo(db: Databases): ManufacturerRepositorySql | ManufacturerRepositoryMongo {
        switch(db) {
            case 'postgres':
                return this.manufacturerRepositorySql;
            case 'mongo':
                return this.manufacturerRepositoryMongo;
            default:
                throw new Error(`Unable to find database ${db} for Manufacturer repository`);
        }
    }
}