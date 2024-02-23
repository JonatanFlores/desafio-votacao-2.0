import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Agenda API')
    .setDescription(
      'This REST API is meant to abstract business rules into endpoints that can be accessed from any client application',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  patchNestJsSwagger();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  const configService = app.get(EnvService);
  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
