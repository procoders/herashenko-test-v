import { Injectable, Inject } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { IMongoRepository } from '../../declarations/interfaces/Repository.interface';
import { Owner } from './owner.model';
import { RepositoryFabric } from '../../classes/Repository.fabric';

@Injectable()
export class OwnerRepositoryMongo extends RepositoryFabric<Owner> implements IMongoRepository<Owner> {
    private readonly ownerRepository: MongoRepository<Owner>;

    constructor(@Inject('OWNER_MODEL') ownerRepository: MongoRepository<Owner>) {
        super(ownerRepository);
        this.ownerRepository = ownerRepository;
    }

    public getRepo(): MongoRepository<Owner> {
        return this.ownerRepository;
    }

    /**
     * Bulk creation of Owners
     *
     * @template E
     * @param {E[]} entityArray
     * @returns {Promise<Owner[]>}
     * @memberof OwnerRepositoryMongo
     */
    public async createMany<E>(entityArray: E[]): Promise<Owner[]> {
        const newOwners = await this.ownerRepository.insertMany(entityArray);

        const ownersIds = [];
        
        for (const [, value] of Object.entries(newOwners.insertedIds)) {
            ownersIds.push(value);
        }

        const owners = await this.ownerRepository.findByIds(ownersIds);

        return owners;
    }
}
