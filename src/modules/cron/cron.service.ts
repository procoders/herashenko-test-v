import { Injectable, Logger } from '@nestjs/common';
import { CarRepositoryManager } from '../car/car.repository.manager';
import { Cron } from '@nestjs/schedule';
import { Databases } from '../../declarations/types/db.enum';

@Injectable()
export class CronService {
    private readonly carRepositoryManager: CarRepositoryManager;

    constructor(carRepositoryManager: CarRepositoryManager) {
        this.carRepositoryManager = carRepositoryManager;
    }

    @Cron('0 0 * * *')
    public async removeAndDiscountOldCars(): Promise<void> {
        try {
            Logger.log('...Started executing removeAndDiscountOldCars()', 'CronService');

            const mongoCarRepository = this.carRepositoryManager.setRepo(Databases.Mongo);
            const sqlCarRepository = this.carRepositoryManager.setRepo(Databases.Postgres);

            await mongoCarRepository.removeOldCarsAndSetDiscount();
            await sqlCarRepository.removeOldCarsAndSetDiscount();
        } catch (error) {
            Logger.error(error.message, error.trace, 'CronService');
        }
    }
}
