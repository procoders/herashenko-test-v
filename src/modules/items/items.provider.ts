import { CarRepositoryManager } from '../car/car.repository.manager';
import { ManufacturerRepositoryManager } from '../manufacturer/manufacturer.repository.manager';
import { OwnerRepositoryManager } from '../owner/owner.repository.manager';

export const itemsProvider = [
    {
        provide: 'CAR_REPOSITORY_MANAGER',
        useFactory: async (carRepositoryManager: CarRepositoryManager): Promise<CarRepositoryManager> =>
            carRepositoryManager,
        inject: [CarRepositoryManager],
    },
    {
        provide: 'MANUFACTURER_REPOSITORY_MANAGER',
        useFactory: async (
            manufacturerRepositoryManager: ManufacturerRepositoryManager,
        ): Promise<ManufacturerRepositoryManager> => manufacturerRepositoryManager,
        inject: [ManufacturerRepositoryManager],
    },
    {
        provide: 'OWNER_REPOSITORY_MANAGER',
        useFactory: async (ownerRepositoryManager: OwnerRepositoryManager): Promise<OwnerRepositoryManager> =>
            ownerRepositoryManager,
        inject: [OwnerRepositoryManager],
    },
];
