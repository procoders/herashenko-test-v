import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, CreateDateColumn, JoinColumn } from 'typeorm';
import { Car } from '../car/car.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Owner extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @ApiProperty()
    @Column()
    public name: string;

    @ApiProperty()
    @Column({ name: 'purchase_date' })
    public purchaseDate: Date;

    @ApiPropertyOptional({ type: () => Car })
    @ManyToOne(() => Car, (car: Car): Owner[] => car.owners, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'car_id' })
    public car: Car;

    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;
}