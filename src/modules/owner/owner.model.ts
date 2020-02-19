import {
    Entity,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
    ObjectIdColumn,
    BaseEntity,
} from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity()
export class Owner extends BaseEntity {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public name: string;

    @Column()
    public purchaseDate: Date;

    @Column()
    public car: ObjectID;

    @UpdateDateColumn()
    public updatedAt: Date;

    @CreateDateColumn()
    public createdAt: Date;
}
