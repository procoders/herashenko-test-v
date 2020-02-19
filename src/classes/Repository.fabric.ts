import { IRepository } from '../declarations/interfaces/Repository.interface';
import { ObjectID } from 'mongodb';
import { MongoRepository, ObjectLiteral, Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

export class RepositoryFabric<T extends ObjectLiteral> implements IRepository<T> {
    private readonly entityRepository: Repository<T> | MongoRepository<T>;
    private readonly entityName: string;

    constructor(entityRepository: Repository<T> | MongoRepository<T>) {
        this.entityRepository = entityRepository;
        this.entityName = this.entityRepository.metadata.name;
    }

    public async create<E>(entity: E): Promise<T> {
        const newEntity = this.entityRepository.create(entity);

        return this.entityRepository.save(newEntity);
    }

    public async updateById<E>(id: string, entity: E): Promise<T> {
        const entityToUpdate = await this.entityRepository.findOne(id);

        if (!entityToUpdate) throw new HttpException(`Cannot find ${this.entityName} with id ${id}`, 404);

        return this.entityRepository.save(Object.assign(entityToUpdate, this.entityRepository.create(entity)));
    }

    public async findAll(): Promise<T[]> {
        return this.entityRepository.find({});
    }

    public async findOne(options: any): Promise<T> {
        const entity = await this.entityRepository.findOne({ ...options });

        if (!entity) throw new HttpException(`Cannot find ${this.entityName} with selected options`, 404);

        return entity;
    }

    public async find(options: any): Promise<T[]> {
        const entitys = await this.entityRepository.find({ ...options });

        if (entitys.length === 0) throw new HttpException(`Cannot find ${this.entityName} with selected options`, 404);

        return entitys;
    }

    public async findById(id: string): Promise<T> {
        const entity = await this.entityRepository.findOne(id);

        if (!entity) throw new HttpException(`Cannot find ${this.entityName} with id ${id}`, 404);

        return entity;
    }

    public async findByIds(ids: string[] | ObjectID[]): Promise<T[]> {
        return this.entityRepository.findByIds(ids);
    }

    public async deleteById(id: string): Promise<T> {
        const entityToDelete = await this.entityRepository.findOne(id);

        if (!entityToDelete) throw new HttpException(`Cannot find ${this.entityName} with id ${id}`, 404);

        entityToDelete.remove();

        return entityToDelete;
    }
}