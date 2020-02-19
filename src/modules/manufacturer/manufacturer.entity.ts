import { BaseEntity, Column, UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Car } from '../car/car.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Manufacturer extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @ApiProperty()
    @Column({ type: 'bigint' })

    public phone: number;
    @ApiProperty()
    @Column()
    public name: string;

    @ApiProperty()
    @Column({ type: 'bigint' })
    public siret: number;

    @ApiPropertyOptional({ type: () => [Car] })
    @OneToMany(() => Car, (car: Car): Manufacturer => car.manufacturer)
    @JoinColumn({ name: 'car_id' })
    public cars: Car[];

    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;
}