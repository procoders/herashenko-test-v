import { Module } from '@nestjs/common';
import providers from './app.provider';
import imports from './modules';

@Module({
    imports,
    providers,
})
export class AppModule {}
