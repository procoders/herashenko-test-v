import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
// tslint:disable-next-line: no-submodule-imports
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    /**
     * log action
     *
     * @param {ExecutionContext} context
     * @param {CallHandler} next
     * @returns {Promise<Observable<any>>}
     * @memberof LoggingInterceptor
     */
    public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest<FastifyRequest>();

        const timestamp = new Date().toLocaleString();
        const method = request.req.method;
        const url = request.req.url;
        const now = Date.now();

        return next.handle().pipe(
            tap(() => {
                Logger.log(`timestamp: ${timestamp}, method: ${method}, path: ${url}, execution time: ${Date.now() - now}ms;\n`, 'LoggingInterceptor');
            }),
        );
    }
}
