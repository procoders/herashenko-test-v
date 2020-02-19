import { ConfigModule } from './config/config.module';
import { DbModule } from './db/db.module';
import { ItemsModule } from './items/items.module';
import { CronModule } from './cron/cron.module';

export default [ConfigModule, DbModule, ItemsModule, CronModule];
