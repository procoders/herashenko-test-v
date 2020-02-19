import { Test, TestingModule } from '@nestjs/testing';
import { CreateCarDto } from '../car/dto/createCar.dto';
import { DbModule } from '../db/db.module';
import { UpdateCarDto } from '../car/dto/UpdateCar.dto';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Databases } from '../../declarations/types/db.enum';
import { CarModule } from '../car/car.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';
import { OwnerModule } from '../owner/owner.module';
import { itemsProvider } from './items.provider';

export default () =>
    describe('ItemsController', () => {
        let itemsController: ItemsController;
        let app: TestingModule;

        let carId: any;

        let repo: Databases;

        const carMock: CreateCarDto = {
            manufacturer: {
                name: 'toster',
                phone: 380506272816,
                siret: 23456789013465,
            },
            price: 11243142.344,
            firstRegistrationDate: new Date('2010-01-19T03:24:00'),
            owners: [
                {
                    name: 'tester',
                    purchaseDate: new Date('1995-12-17T03:24:00'),
                },
            ],
        };

        beforeAll(async () => {
            app = await Test.createTestingModule({
                imports: [DbModule, CarModule, ManufacturerModule, OwnerModule],
                controllers: [ItemsController],
                providers: [ItemsService, ...itemsProvider],
            }).compile();

            itemsController = app.get<ItemsController>(ItemsController);

            repo = Databases.Postgres;
        });

        describe('create postgres', () => {
            test('should return new instance of Car', async () => {
                const result = await itemsController.create(repo, carMock) as any;

                carId = result.id;

                expect(result.manufacturer.name).toBe(carMock.manufacturer?.name);
            });
            
            test('should return error', async () => {
                const create: CreateCarDto = Object.assign(CreateCarDto);

                const result = await itemsController.create(repo, create) as any;

                expect(result).toBeInstanceOf(Error);
            });
        });

        describe('getAll postgres', () => {
            test('should return array of cars', async () => {
                const result = await itemsController.getAll(repo);

                expect(result).toBeInstanceOf(Array);
            });
        });

        describe('getById postgres', () => {
            test('should return car with sended id', async () => {
                const result = await itemsController.getById(repo, carId);

                expect(result.id).toBe(carId);
            });

            test('should return error', async () => {
                const result = await itemsController.getById(repo, '');

                expect(result).toBeInstanceOf(Error);
            });
        });

        describe('update postgres', () => {
            test('should return updated car', async () => {
                const timestamp = new Date(Date.now());

                const carToUpdateMock: UpdateCarDto = Object.assign(carMock, {
                    price: 0.344,
                    firstRegistrationDate: timestamp,
                });

                const result = await itemsController.update(repo, carId, carToUpdateMock);

                expect(result.price).toBe('0.34');
            });

            test('should return error', async () => {
                const update: UpdateCarDto = Object.assign(UpdateCarDto);

                const result = await itemsController.update(repo, '', update);

                expect(result).toBeInstanceOf(Error);
            })
        });

        describe('getManufacturerByCarId postgres', () => {
            test('should return manufacturer', async () => {
                const result = await itemsController.getManufacturer(repo, carId);

                expect(result.name).toBe(carMock.manufacturer?.name);
            });

            test('should return error', async () => {
                const result = await itemsController.getManufacturer(repo, '');

                expect(result).toBeInstanceOf(Error);
            })
        });

        describe('deleteById postgres', () => {
            test('should return deleted car', async () => {
                const result = await itemsController.deleteById(repo, carId);

                expect(result).not.toBeNull();
            });
        });

        repo = Databases.Mongo;

        describe('create mongo', () => {
            test('should return new instance of Car', async () => {
                const result = await itemsController.create(repo, carMock) as any;

                carId = result.id;

                expect(result.manufacturer.name).toBe(carMock.manufacturer?.name);
            });
        });

        describe('getAll mongo', () => {
            test('should return array of cars', async () => {
                const result = await itemsController.getAll(repo);

                expect(result).toBeInstanceOf(Array);
            });
        });

        describe('getById mongo', () => {
            test('should return car with sended id', async () => {
                const result = await itemsController.getById(repo, carId);

                expect(result.id).toBe(carId);
            });
        });

        describe('update mongo', () => {
            test('should return updated car', async () => {
                const timestamp = new Date(Date.now());

                const carToUpdateMock: UpdateCarDto = Object.assign(carMock, {
                    price: 0.344,
                    firstRegistrationDate: timestamp,
                });

                const result = await itemsController.update(repo, carId, carToUpdateMock);

                expect(result.price).toBe('0.34');
            });
        });

        describe('getManufacturerByCarId mongo', () => {
            test('should return manufacturer', async () => {
                const result = await itemsController.getManufacturer(repo, carId);

                expect(result.name).toBe(carMock.manufacturer?.name);
            });
        });

        describe('deleteById mongo', () => {
            test('should return deleted car', async () => {
                const result = await itemsController.deleteById(repo, carId);

                expect(result).not.toBeNull();
            });
        });
    });
