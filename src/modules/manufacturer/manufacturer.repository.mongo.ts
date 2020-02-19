import { Injectable, Inject } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { IMongoRepository } from '../../declarations/interfaces/Repository.interface';
import { Manufacturer } from './manufacturer.model';
import { RepositoryFabric } from '../../classes/Repository.fabric';

@Injectable()
export class ManufacturerRepositoryMongo extends RepositoryFabric<Manufacturer> implements IMongoRepository<Manufacturer> {
    private readonly manufacturerRepository: MongoRepository<Manufacturer>;

    constructor(@Inject('MANUFACTURER_MODEL') manufacturerRepository: MongoRepository<Manufacturer>) {
        super(manufacturerRepository);
    }

    public getRepo(): MongoRepository<Manufacturer> {
        return this.manufacturerRepository;
    }
}
