import { Databases } from '../types/db.enum';

export interface IRepositoryManager<T, E> {
    setRepo: (db: Databases) => T | E;
}