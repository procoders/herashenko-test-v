import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    public async catch(
        exception: HttpException,
        host: ArgumentsHost
    ): Promise<void> {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply<ServerResponse>>();
        const request = ctx.getRequest<FastifyRequest>();

        const status = exception.getStatus
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            code: status,
            timestamp: new Date().toLocaleString(),
            path: request.req.url,
            method: request.req.method,
            message: `${exception.message.message || exception.message || exception.message.message}` || null
        };

        const { code, method, path: url, message } = errorResponse;

        Logger.error(
            `code ${code}, method: ${method}, path: ${url}`,
            `message: ${message}`,
            'ErrorHandler'
        );

        response.status(status).send(errorResponse);
    }
}