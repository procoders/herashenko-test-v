import { CreateManufacturerDto } from '../../manufacturer/dto/CreateManufacturer.dto';
import { CreateOwnerDto } from '../../owner/dto/CreateOwner.dto';
import { IsDate, ValidateNested, IsUUID, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
    @ApiPropertyOptional({ type: () => CreateManufacturerDto })
    @ValidateNested()
    @IsOptional()
    @Type(() => CreateManufacturerDto)
    public manufacturer?: CreateManufacturerDto;

    @ApiPropertyOptional()
    @IsUUID('4')
    @IsOptional()
    public manufacturerId?: string;

    @ApiProperty()
    public price: number;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    public firstRegistrationDate: Date;

    @ApiPropertyOptional({ type: () => CreateOwnerDto })
    @ValidateNested()
    @Type(() => CreateOwnerDto)
    owners?: [CreateOwnerDto];

    @ApiPropertyOptional()
    @IsArray()
    @IsOptional()
    ownersId?: string[];
}
