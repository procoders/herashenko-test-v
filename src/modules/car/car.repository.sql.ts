import { Injectable, Inject } from '@nestjs/common';
import { Car } from './car.entity';
import { Repository, Between, LessThan } from 'typeorm';
import { ISqlRepository } from '../../declarations/interfaces/Repository.interface';
import { ICarsToDiscountAndDelete } from './interfaces/carsToDiscountAndDelete.interface';
import { promiseEach } from '../../utils/promiseEach';
import { monthToDate } from '../../utils/monthToDate';
import { RepositoryFabric } from '../../classes/Repository.fabric';

@Injectable()
export class CarRepositorySql extends RepositoryFabric<Car> implements ISqlRepository<Car> {
    private readonly carRepository: Repository<Car>;

    constructor(@Inject('CAR_ENTITY') carRepository: Repository<Car>) {
        super(carRepository);
        this.carRepository = carRepository;
    }

    public getRepo(): Repository<Car> {
        return this.carRepository;
    }

    public async removeOldCarsAndSetDiscount(): Promise<ICarsToDiscountAndDelete> {
        const discountCars = await this.carRepository.findAndCount({
            where: {
                firstRegistrationDate: Between(monthToDate(18), monthToDate(12)),
                discountedPrice: null
            },
        });

        const oldCars = await this.carRepository.findAndCount({
            where: {
                firstRegistrationDate: LessThan(monthToDate(18)),
            },
        });

        if (oldCars[0]) await this.carRepository.remove(oldCars[0]);

        if (discountCars[0]) {
            await promiseEach(discountCars[0], async (car: Car) => {
                car.discountedPrice = car.price * 0.2;
                car = this.carRepository.create(car);
            });

            await this.carRepository.manager.save(discountCars[0]);
        }
        return { oldCardsCountToDelete: oldCars[1], carsCountToDiscount: discountCars[1] };
    }
}
