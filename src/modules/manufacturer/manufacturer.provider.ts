import { Connection, Repository, MongoRepository } from 'typeorm';

import { Manufacturer as ManufacturerEntity } from './manufacturer.entity';
import { Manufacturer as ManufacturerModel } from './manufacturer.model';

export const manufacturerProviders = [
    {
        provide: `MANUFACTURER_ENTITY`,
        useFactory: async (connection: Connection): Promise<Repository<ManufacturerEntity>> => connection.getRepository(ManufacturerEntity),
        inject: ['DATABASE_CONNECTION'],
    },
    {
        provide: 'MANUFACTURER_MODEL',
        useFactory: async (connection: Connection): Promise<MongoRepository<ManufacturerModel>> => connection.getMongoRepository(ManufacturerModel),
        inject: ['MONGODB_CONNECTION']
    }
]