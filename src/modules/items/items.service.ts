import { Injectable, Inject, HttpException } from '@nestjs/common';
import { CarRepositoryManager } from '../car/car.repository.manager';
import { OwnerRepositoryManager } from '../owner/owner.repository.manager';
import { ManufacturerRepositoryManager } from '../manufacturer/manufacturer.repository.manager';
import { Car as CarEntity } from '../car/car.entity';
import { Car as CarModel } from '../car/car.model';
import { Owner as OwnerEntity } from '../owner/owner.entity';
import { Owner as OwnerModel } from '../owner/owner.model';
import { Manufacturer as ManufacturerEntity } from '../manufacturer/manufacturer.entity';
import { Manufacturer as ManufacturerModel } from '../manufacturer/manufacturer.model';
import { Databases } from '../../declarations/types/db.enum';
import { CarRepositorySql } from '../car/car.repository.sql';
import { CarRepositoryMongo } from '../car/car.repository.mongo';
import { CreateCarDto } from '../car/dto/createCar.dto';
import { ManufacturerRepositoryMongo } from '../manufacturer/manufacturer.repository.mongo';
import { OwnerRepositoryMongo } from '../owner/owner.repository.mongo';
import { promiseEach } from '../../utils/promiseEach';
import { ManufacturerRepositorySql } from '../manufacturer/manufacturer.repository.sql';
import { OwnerRepositorySql } from '../owner/owner.repository.sql';
import { UpdateCarDto } from '../car/dto/UpdateCar.dto';
import { ObjectID } from 'mongodb';

@Injectable()
export class ItemsService {
    private readonly carRepositoryManager: CarRepositoryManager;
    private readonly ownerRepositoryManager: OwnerRepositoryManager;
    private readonly manufacturerRepositoryManager: ManufacturerRepositoryManager;
    constructor(
        @Inject('CAR_REPOSITORY_MANAGER') carRepositoryManager: CarRepositoryManager,
        @Inject('OWNER_REPOSITORY_MANAGER') ownerRepositoryManager: OwnerRepositoryManager,
        @Inject('MANUFACTURER_REPOSITORY_MANAGER')
        manufacturerRepositoryManager: ManufacturerRepositoryManager,
    ) {
        this.carRepositoryManager = carRepositoryManager;
        this.ownerRepositoryManager = ownerRepositoryManager;
        this.manufacturerRepositoryManager = manufacturerRepositoryManager;
    }

    public async findAll(repo: Databases): Promise<CarEntity[] | CarModel[]> {
        const carRepository = this.carRepositoryManager.setRepo(repo);
        return carRepository.findAll();
    }

    public async findById(repo: Databases, id: string): Promise<CarEntity | CarModel> {
        const carRepository = this.carRepositoryManager.setRepo(repo);
        return carRepository.findById(id);
    }

    public async getManufacturerByCarId(
        repo: Databases,
        id: string,
    ): Promise<ManufacturerEntity | ManufacturerModel> {
        const carRepository = this.carRepositoryManager.setRepo(repo);
        const manufacturerRepository = this.manufacturerRepositoryManager.setRepo(repo);
        try {
            let carsManufacturer;

            if (carRepository instanceof CarRepositorySql) {
                const car = await carRepository.findOne({ where: { id }, relations: ['manufacturer'] });

                carsManufacturer = car.manufacturer;
            }

            if (carRepository instanceof CarRepositoryMongo) {
                const car = await carRepository.findById(id);

                carsManufacturer = await manufacturerRepository.findById(car.id.toString());
            }

            if (!carsManufacturer) throw new HttpException('Cannot find manufacturer for this car', 404);

            return carsManufacturer;
        } catch (error) {
            return error;
        }
    }

    public async create(repo: Databases, car: CreateCarDto): Promise<CarEntity | CarModel> {
        const carRepository = this.carRepositoryManager.setRepo(repo);
        const manufacturerRepository = this.manufacturerRepositoryManager.setRepo(repo);
        const ownerRepository = this.ownerRepositoryManager.setRepo(repo);

        const queryRunner = carRepository.getRepo().manager.connection.createQueryRunner();
        try {
            await queryRunner.startTransaction();
            let newCar: any;

            // Work with mongo repository
            if (
                carRepository instanceof CarRepositoryMongo &&
                manufacturerRepository instanceof ManufacturerRepositoryMongo &&
                ownerRepository instanceof OwnerRepositoryMongo
            ) {
                newCar = await carRepository.create(car);

                if (car.manufacturer) {
                    const manufacturer = await manufacturerRepository.create(
                        Object.assign(car.manufacturer, { cars: [newCar.id] }),
                    );

                    await carRepository.updateById(newCar.id, { manufacturer: manufacturer.id });

                    newCar = Object.assign(newCar, { manufacturer });
                } else if (car.manufacturerId) {
                    const manufacturer = await manufacturerRepository.findById(car.manufacturerId);

                    await carRepository.updateById(newCar.id, { manufacturer: manufacturer.id });

                    newCar = Object.assign(newCar, { manufacturer });
                }

                if (car.owners) {
                    await promiseEach(car.owners, async (owner: any) => (owner.car = newCar.id));
                    const newOwners = await ownerRepository.createMany(Object.assign(car.owners));

                    const owners = newOwners.map((owner: OwnerModel) => owner.id);

                    await carRepository.updateById(newCar.id, { owners });

                    newCar = Object.assign(newCar, { owners: newOwners });
                } else if (car.ownersId) {
                    const findOwners = await ownerRepository.findByIds(car.ownersId.map((ownerId: string) => new ObjectID(ownerId)));

                    if (findOwners.length === 0)
                        throw new HttpException('Cannot find owners with selected ids', 404);

                    const owners = findOwners.map((owner: OwnerModel) => owner.id);

                    await carRepository.updateById(newCar.id, { owners });

                    newCar = Object.assign(newCar, { owners: findOwners });
                }
            }

            if (
                carRepository instanceof CarRepositorySql &&
                manufacturerRepository instanceof ManufacturerRepositorySql &&
                ownerRepository instanceof OwnerRepositorySql
            ) {
                newCar = await carRepository.getRepo().create(car);

                if (car.manufacturer) {
                    const manufacturer = await manufacturerRepository.create(car.manufacturer);

                    newCar = Object.assign(newCar, { manufacturer });
                } else if (car.manufacturerId) {
                    const manufacturer = await manufacturerRepository.findById(car.manufacturerId);

                    newCar = Object.assign(newCar, { manufacturer });
                }

                const createdCar = await newCar.save();

                let newOwners;

                if (car.owners) {
                    newOwners = await ownerRepository.getRepo().create([...car.owners]);

                    newOwners.forEach((owner: OwnerEntity) => (owner.car = createdCar));

                    await ownerRepository.getRepo().manager.save(newOwners);
                } else if (car.ownersId) {
                    const owners = await ownerRepository.findByIds(car.ownersId);

                    if (owners.length === 0) throw new Error(`owners with sended ids not found`);

                    owners.forEach((owner: OwnerEntity) => (owner.car = createdCar));

                    await ownerRepository.getRepo().manager.save(owners);
                }

                newCar = await carRepository.findOne({
                    where: { id: createdCar.id },
                    relations: ['owners', 'manufacturer'],
                });
            }

            await queryRunner.commitTransaction();

            return newCar;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return error;
        }
    }

    public async update(repo: Databases, id: string, car: UpdateCarDto): Promise<CarEntity | CarModel> {
        const carRepository = this.carRepositoryManager.setRepo(repo);
        const manufacturerRepository = this.manufacturerRepositoryManager.setRepo(repo);
        const ownerRepository = this.ownerRepositoryManager.setRepo(repo);

        const queryRunner = carRepository.getRepo().manager.connection.createQueryRunner();
        try {
            await queryRunner.startTransaction();
            let carToUpdate: any;

            // Work with mongo repository
            if (
                carRepository instanceof CarRepositoryMongo &&
                manufacturerRepository instanceof ManufacturerRepositoryMongo &&
                ownerRepository instanceof OwnerRepositoryMongo
            ) {

                carToUpdate = await carRepository.findById(id);

                if (car.manufacturer) {
                    const manufacturer = await manufacturerRepository.create(
                        Object.assign(car.manufacturer, { cars: [carToUpdate.id] }),
                    );

                    await carRepository.updateById(carToUpdate.id, { manufacturer: manufacturer.id });

                    carToUpdate = Object.assign(carToUpdate, { manufacturer });
                } else if (car.manufacturerId) {
                    const manufacturer = await manufacturerRepository.findById(car.manufacturerId);

                    await carRepository.updateById(carToUpdate.id, { manufacturer: manufacturer.id });

                    carToUpdate = Object.assign(carToUpdate, { manufacturer });
                } else if (car.owners) {
                    await promiseEach(car.owners, async (owner: any) => (owner.car = carToUpdate.id));
                    const newOwners = await ownerRepository.createMany(Object.assign(car.owners));

                    const ownersId = newOwners.map((owner: OwnerModel) => owner.id);

                    const owners = carToUpdate.owners.concat(ownersId);

                    await carRepository.updateById(carToUpdate.id, { owners });

                    carToUpdate = Object.assign(carToUpdate, { owners: carToUpdate.owners });
                } else if (car.ownersId) {
                    const findOwners = await ownerRepository.findByIds(car.ownersId.map((ownerId: string) => new ObjectID(ownerId)));

                    if (findOwners.length === 0)
                        throw new HttpException('Cannot find owners with selected ids', 404);

                    const ownersId = findOwners.map((owner: OwnerModel) => owner.id);

                    const owners = carToUpdate.owners.concat(ownersId);

                    await carRepository.updateById(carToUpdate.id, { $addToSet: { owners } });

                    const newOwners = await ownerRepository.findByIds(owners);

                    carToUpdate = Object.assign(carToUpdate, { owners: newOwners });
                } else {
                    carRepository.updateById(carToUpdate.id, car);
                }
            }

            if (
                carRepository instanceof CarRepositorySql &&
                manufacturerRepository instanceof ManufacturerRepositorySql &&
                ownerRepository instanceof OwnerRepositorySql
            ) {
                carToUpdate = await carRepository.findById(id);

                if (car.manufacturer) {
                    const manufacturer = await manufacturerRepository.create(car.manufacturer);

                    carToUpdate = Object.assign(carToUpdate, { manufacturer });
                } else if (car.manufacturerId) {
                    const manufacturer = await manufacturerRepository.findById(car.manufacturerId);

                    carToUpdate = Object.assign(carToUpdate, { manufacturer });
                }

                const createdCar = await carRepository.updateById(id, { ...carToUpdate, ...car });

                let newOwners;

                if (car.owners) {
                    newOwners = await ownerRepository.getRepo().create([...car.owners]);

                    newOwners.forEach((owner: OwnerEntity) => (owner.car = createdCar));

                    await ownerRepository.getRepo().manager.save(newOwners);
                } else if (car.ownersId) {
                    const owners = await ownerRepository.findByIds(car.ownersId);

                    if (owners.length === 0) throw new Error(`owners with sended ids not found`);

                    owners.forEach((owner: OwnerEntity) => (owner.car = createdCar));

                    await ownerRepository.getRepo().manager.save(owners);
                }

                carToUpdate = await carRepository.findOne({
                    where: { id: createdCar.id },
                    relations: ['owners', 'manufacturer'],
                });
            }

            await queryRunner.commitTransaction();

            return carToUpdate;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return error;
        }
    }

    public async deleteById(repo: Databases, id: string): Promise<CarEntity | CarModel> {
        const carRepository = this.carRepositoryManager.setRepo(repo);
        const queryRunner = carRepository.getRepo().manager.connection.createQueryRunner();
        try {
            await queryRunner.startTransaction();

            const carToDelete = await carRepository.deleteById(id);

            await queryRunner.commitTransaction();

            return carToDelete;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return error;
        }
    }
}
