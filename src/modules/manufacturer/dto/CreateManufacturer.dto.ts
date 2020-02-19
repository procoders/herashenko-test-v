import { IsInt, IsPhoneNumber } from 'class-validator';
import { IsSiret } from '../../../helpers/validators/IsSiretNumber.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManufacturerDto {
    @ApiProperty()
    public name: string;

    @ApiProperty()
    @IsPhoneNumber('UA')
    public phone: number;

    @ApiProperty()
    @IsInt({ message: 'siret must be integer' })
    @IsSiret({ message: 'siret must contain 14 numbers' })
    public siret: number;
}