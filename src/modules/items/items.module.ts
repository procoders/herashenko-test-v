import { Module } from '@nestjs/common';
import { CarModule } from '../car/car.module';
import { OwnerModule } from '../owner/owner.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';
import { itemsProvider } from './items.provider';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';

@Module({
    imports: [CarModule, OwnerModule, ManufacturerModule],
    providers: [...itemsProvider, ItemsService],
    controllers: [ItemsController]
})
export class ItemsModule {}