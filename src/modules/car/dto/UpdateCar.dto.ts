import { ValidateNested, IsOptional, IsUUID, IsDate, IsArray } from 'class-validator';

import { CreateManufacturerDto } from '../../manufacturer/dto/CreateManufacturer.dto';

import { CreateOwnerDto } from '../../owner/dto/CreateOwner.dto';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCarDto {
    @ApiPropertyOptional(({ type: () => CreateManufacturerDto}))
    @ValidateNested()
    @IsOptional()
    @Type(() => CreateManufacturerDto)
    public manufacturer?: CreateManufacturerDto;

    @ApiPropertyOptional()
    @IsUUID('4')
    @IsOptional()
    public manufacturerId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    public price: number;

    @ApiPropertyOptional()
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    public firstRegistrationDate: Date;

    @ApiPropertyOptional({ type: () => [CreateOwnerDto]})
    @ValidateNested()
    @IsOptional()
    @Type(() => CreateOwnerDto)
    public owners?: [CreateOwnerDto];

    @ApiPropertyOptional()
    @IsArray()
    @IsOptional()
    public ownersId?: string[];
}
