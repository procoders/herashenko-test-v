import { Connection, Repository, MongoRepository } from 'typeorm';

import { Car as CarEntity } from './car.entity';
import { Car as CarModel } from './car.model';

export const carProviders = [
    {
        provide: `CAR_ENTITY`,
        useFactory: async (connection: Connection): Promise<Repository<CarEntity>> => connection.getRepository(CarEntity),
        inject: ['DATABASE_CONNECTION'],
    },
    {
        provide: 'CAR_MODEL',
        useFactory: async (connection: Connection): Promise<MongoRepository<CarModel>> => connection.getMongoRepository(CarModel),
        inject: ['MONGODB_CONNECTION']
    }
]