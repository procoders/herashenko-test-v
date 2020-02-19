import { Injectable, Inject } from '@nestjs/common';
import { Car } from './car.model';
import { MongoRepository } from 'typeorm';
import { IMongoRepository } from '../../declarations/interfaces/Repository.interface';
import { ICarsToDiscountAndDelete } from './interfaces/carsToDiscountAndDelete.interface';
import { monthToDate } from '../../utils/monthToDate';
import { promiseEach } from '../../utils/promiseEach';
import { RepositoryFabric } from '../../classes/Repository.fabric';


/**
 * Car repository
 *
 * @export
 * @class CarRepositoryMongo
 * @extends {RepositoryFabric<Car>}
 * @implements {IMongoRepository<Car>}
 */
@Injectable()
export class CarRepositoryMongo extends RepositoryFabric<Car> implements IMongoRepository<Car> {
    private readonly carRepository: MongoRepository<Car>;

    constructor(@Inject('CAR_MODEL') carRepository: MongoRepository<Car>) {
        super(carRepository);
        this.carRepository = carRepository;
    }

    /**
     *
     *
     * @returns {MongoRepository<Car>}
     * @memberof CarRepositoryMongo
     */
    public getRepo(): MongoRepository<Car> {
        return this.carRepository;
    }

    /**
     * remove cars and update discount
     *
     * @returns {Promise<ICarsToDiscountAndDelete>}
     * @memberof CarRepositoryMongo
     */
    public async removeOldCarsAndSetDiscount(): Promise<ICarsToDiscountAndDelete> {
        const discountCars = await this.carRepository.findAndCount({
            where: {
                firstRegistrationDate: {
                    $gte: monthToDate(18).toISOString(),
                    $lt: monthToDate(12).toISOString(),
                },
                discountedPrice: null
            },
        });

        const oldCars = await this.carRepository.findAndCount({
            where: {
                firstRegistrationDate: { $lt: monthToDate(18).toISOString() },
            },
        });

        if (oldCars[0]) await this.carRepository.remove(oldCars[0]);

        if (discountCars[0]) {
            await promiseEach(discountCars[0], async (car: Car) => {
                car.discountedPrice = car.price * 0.2;
            });

            await this.carRepository.manager.save(discountCars[0]);
        }
        return { oldCardsCountToDelete: oldCars[1], carsCountToDiscount: discountCars[1] };
    }
}
