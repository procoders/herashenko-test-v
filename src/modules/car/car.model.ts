import { Entity, UpdateDateColumn, CreateDateColumn, Column, BaseEntity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity()
export class Car extends BaseEntity {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    public price: number;

    @Column()
    public firstRegistrationDate: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    public discountedPrice: number;

    @Column({ nullable: true })
    public manufacturer: ObjectID;

    @Column({ nullable: true })
    public owners: ObjectID[];

    @UpdateDateColumn()
    public updatedAt: Date;

    @CreateDateColumn()
    public createdAt: Date;
}
