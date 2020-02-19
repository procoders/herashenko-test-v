import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CarModule } from '../car/car.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [CarModule, ScheduleModule.forRoot()],
    providers: [CronService],
    exports: [CronService]
})
export class CronModule {}