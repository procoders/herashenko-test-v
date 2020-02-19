import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ISqlRepository } from '../../declarations/interfaces/Repository.interface';
import { Owner } from './owner.entity';
import { RepositoryFabric } from '../../classes/Repository.fabric';

@Injectable()
export class OwnerRepositorySql extends RepositoryFabric<Owner> implements ISqlRepository<Owner> {
    private readonly ownerRepository: Repository<Owner>;

    constructor(@Inject('OWNER_ENTITY') ownerRepository: Repository<Owner>) {
        super(ownerRepository);
        this.ownerRepository = ownerRepository;
    }

    public getRepo(): Repository<Owner> {
        return this.ownerRepository;
    }

}
