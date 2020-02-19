import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'fastify-helmet';

async function bootstrap(): Promise<void> {
    try {
        const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 2502;
        const host = process.env.HOST || 'localhost';

        app.enableCors();
        app.useGlobalPipes(new ValidationPipe());
        app.register(helmet);

        const options = new DocumentBuilder()
            .setTitle('Test task API')
            .setDescription('description')
            .setVersion('1.0')
            .addTag('cars')
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('api', app, document);

        await app.listen(port, host, () => {
            Logger.log(`✅ server started on port: ${port} host: ${host}`, 'main.ts');
        });
    } catch (error) {
        Logger.error(error.name, error.stack, error.message);
    }
}
bootstrap();
