// ----Test imports---- //

import utils from './src/utils/utils.test';
import itemsController from './src/modules/items/items.controller.test';
import interceptors from './src/interceptors/interceptors.test';

// ----Test imports end---- //

describe('run all tests', () => {
    utils();
    itemsController();
    interceptors();
});
