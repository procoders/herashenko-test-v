import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ISqlRepository } from '../../declarations/interfaces/Repository.interface';
import { Manufacturer } from './manufacturer.entity';
import { RepositoryFabric } from '../../classes/Repository.fabric';

@Injectable()
export class ManufacturerRepositorySql extends RepositoryFabric<Manufacturer> implements ISqlRepository<Manufacturer> {
    private readonly manufacturerRepository: Repository<Manufacturer>;

    constructor(@Inject('MANUFACTURER_ENTITY') manufacturerRepository: Repository<Manufacturer>) {
        super(manufacturerRepository);
        this.manufacturerRepository = manufacturerRepository;
    }

    public getRepo(): Repository<Manufacturer> {
        return this.manufacturerRepository;
    }
}
