import { Controller, Get, Post, Body, Param, Headers, Put, Delete } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Databases } from '../../declarations/types/db.enum';
import { CreateCarDto } from '../car/dto/createCar.dto';
import { UpdateCarDto } from '../car/dto/UpdateCar.dto';
import { Car as CarEntity } from '../car/car.entity';
import { Car as CarModel } from '../car/car.model';
import { Manufacturer as ManufacturerEntity } from '../manufacturer/manufacturer.entity';
import { Manufacturer as ManufacturerModel } from '../manufacturer/manufacturer.model';
import { ApiBody, ApiTags, ApiHeader, ApiCreatedResponse } from '@nestjs/swagger';

@ApiTags('cars')
@ApiHeader({
    name: 'repo',
    description: 'Provide this header to work with selected db',
    enum: ['mongo', 'postgres'],
})
@Controller('cars')
export class ItemsController {
    private readonly itemsService: ItemsService;

    constructor(itemsService: ItemsService) {
        this.itemsService = itemsService;
    }

    @ApiCreatedResponse({
        description: 'Get all Cars',
        type: CarEntity,
    })
    @Get()
    public async getAll(@Headers('repo') repo: Databases): Promise<CarEntity[] | CarModel[]> {
        try {
            return await this.itemsService.findAll(repo);
        } catch (error) {
            return error;
        }
    }

    @ApiCreatedResponse({
        description: 'Get Car by provided id',
        type: CarEntity,
    })
    @Get(':id')
    public async getById(
        @Headers('repo') repo: Databases,
        @Param('id') id: string,
    ): Promise<CarEntity | CarModel> {
        try {
            return await this.itemsService.findById(repo, id);
        } catch (error) {
            return error;
        }
    }

    @ApiCreatedResponse({
        description: 'Get manufacturer by car id',
        type: ManufacturerEntity,
    })
    @Get(':id/manufacturer')
    public async getManufacturer(
        @Headers('repo') repo: Databases,
        @Param('id') id: string,
    ): Promise<ManufacturerEntity | ManufacturerModel> {
        try {
            return await this.itemsService.getManufacturerByCarId(repo, id);
        } catch (error) {
            return error;
        }
    }

    @ApiCreatedResponse({
        description: 'Create new Car',
        type: CarEntity,
    })
    @Post()
    public async create(
        @Headers('repo') repo: Databases,
        @Body() body: CreateCarDto,
    ): Promise<CarEntity | CarModel> {
        try {
            return await this.itemsService.create(repo, body);
        } catch (error) {
            return error;
        }
    }

    @ApiCreatedResponse({
        description: 'Update Car by provided id',
        type: CarEntity,
    })
    @ApiBody({ type: UpdateCarDto })
    @Put(':id')
    public async update(
        @Headers('repo') repo: Databases,
        @Param('id') id: string,
        @Body() body: UpdateCarDto,
    ): Promise<CarEntity | CarModel> {
        try {
            return await this.itemsService.update(repo, id, body);
        } catch (error) {
            return error;
        }
    }

    @ApiCreatedResponse({
        description: 'Delete Car by provided id',
        type: CarEntity,
    })
    @Delete(':id')
    public async deleteById(
        @Headers('repo') repo: Databases,
        @Param('id') id: string,
    ): Promise<CarEntity | CarModel> {
        try {
            return await this.itemsService.deleteById(repo, id);
        } catch (error) {
            return error;
        }
    }
}
