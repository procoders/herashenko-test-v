import { HttpErrorFilter } from './ErrorHandler.interceptor';
import { LoggingInterceptor } from './Logger.interceptor';
import { TestingModule, Test } from '@nestjs/testing';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import appProvider from '../app.provider';

export default () =>
    describe('testing interceptors', () => {
        let app: INestApplication;

        beforeAll(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [...appProvider],
            }).compile();

            app = module.createNestApplication();
        });
        describe('ErrorHandler', () => {
            test('should be initialized', async () => {
                const result = new HttpErrorFilter();

                expect(result).toBeDefined();
            });

            test('should return 404', async () => {
                await request(app.getHttpServer())
                    .get('/test')
                    .expect(404);
            });
        });

        describe('Logger', () => {
            test('should be initialized', async () => {
                const result = new LoggingInterceptor();
                result.intercept({} as any, {} as any);
                expect(result).toBeDefined();
            });
        });
    });
