import { Connection, Repository, MongoRepository } from 'typeorm';

import { Owner as OwnerEntity } from './owner.entity';
import { Owner as OwnerModel } from './owner.model';

export const ownerProviders = [
    {
        provide: `OWNER_ENTITY`,
        useFactory: async (connection: Connection): Promise<Repository<OwnerEntity>> => connection.getRepository(OwnerEntity),
        inject: ['DATABASE_CONNECTION'],
    },
    {
        provide: 'OWNER_MODEL',
        useFactory: async (connection: Connection): Promise<MongoRepository<OwnerModel>> => connection.getMongoRepository(OwnerModel),
        inject: ['MONGODB_CONNECTION']
    }
];
