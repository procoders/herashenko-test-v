import { MongoRepository, Repository } from 'typeorm';

export interface IRepository<T> {
    create: <E>(entity: E) => Promise<T>;
    updateById: <E>(id: string, entity: E) => Promise<T>;
    findAll: () => Promise<T[]>;
    findById: (id: string) => Promise<T>;
    findByIds: (ids: string[]) => Promise<T[]>;
    find: (options: any) => Promise<T[]>;
    findOne: (options: any) => Promise<T>;
}

export interface IMongoRepository<T> extends IRepository<T> {
    getRepo: () => MongoRepository<T>;
}

export interface ISqlRepository<T> extends IRepository<T> {
    getRepo: () => Repository<T>;
}