import { Connection } from 'typeorm';

export interface IConnectionManager {
    getConnection: () => Promise<Connection>;
    establishConnection: () => Promise<Connection>;
    closeConnection: () => Promise<void>;
}