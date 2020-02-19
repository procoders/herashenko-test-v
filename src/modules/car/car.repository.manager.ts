import { IRepositoryManager } from '../../declarations/interfaces/RepositoryManager.interface';
import { CarRepositorySql } from './car.repository.sql';
import { CarRepositoryMongo } from './car.repository.mongo';
import { Databases } from '../../declarations/types/db.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CarRepositoryManager implements IRepositoryManager<CarRepositorySql, CarRepositoryMongo> {
    private readonly carRepositorySql: CarRepositorySql;
    private readonly carRepositoryMongo: CarRepositoryMongo;

    constructor(carRepositorySql: CarRepositorySql, carRepositoryMongo: CarRepositoryMongo) {
        this.carRepositorySql = carRepositorySql;
        this.carRepositoryMongo = carRepositoryMongo;
    }

    public setRepo(db: Databases): CarRepositorySql | CarRepositoryMongo {
        switch(db) {
            case 'postgres':
                return this.carRepositorySql;
            case 'mongo':
                return this.carRepositoryMongo;
            default:
                throw new Error(`Unable to find database ${db} for Car repository`);
        }
    }
}