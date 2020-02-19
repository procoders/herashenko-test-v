import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    Column,
    OneToMany,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Owner } from '../owner/owner.entity';
import { Manufacturer } from '../manufacturer/manufacturer.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Car extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @ApiProperty()
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    public price: number;

    @ApiProperty()
    @Column({ name: 'first_registration_date' })
    public firstRegistrationDate: Date;

    @ApiProperty()
    @Column({ name: 'discounted_price', nullable: true, type: 'decimal', precision: 10, scale: 2 })
    public discountedPrice: number;

    @ApiPropertyOptional({ type: () => Manufacturer })
    @ManyToOne(() => Manufacturer, (manufacturer: Manufacturer): Car[] => manufacturer.cars, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'manufacturer_id' })
    public manufacturer: Manufacturer;

    @ApiPropertyOptional({ type: () => [Owner] })
    @OneToMany(() => Owner, (owner: Owner): Car => owner.car)
    @JoinColumn({ name: 'owner_id' })
    public owners: Owner[];

    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;
}
