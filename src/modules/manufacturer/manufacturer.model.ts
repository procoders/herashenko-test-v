import { Column, UpdateDateColumn, CreateDateColumn, Entity, ObjectIdColumn, BaseEntity } from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity()
export class Manufacturer extends BaseEntity {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public phone: number;

    @Column()
    public name: string;

    @Column()
    public siret: number;

    @Column()
    public cars: ObjectID[];

    @UpdateDateColumn()
    public updatedAt: Date;

    @CreateDateColumn()
    public createdAt: Date;
}
