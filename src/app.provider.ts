  
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './interceptors/ErrorHandler.interceptor';
import { LoggingInterceptor } from './interceptors/Logger.interceptor';

export default [
    {
        provide: APP_FILTER,
        useClass: HttpErrorFilter
    },
    {
        provide: APP_INTERCEPTOR,
        useClass: LoggingInterceptor
    }
];