import { Type } from 'class-transformer';
import { IsDate, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOwnerDto {
    @ApiProperty()
    @Length(2)
    public name: string;

    @ApiProperty()
    @Type(() => Date)
    @IsDate()
    public purchaseDate: Date;
}