import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './modules';

async function bootstrap() {
  const PORT = process.env.PORT || 8088;
  const GLOBAL_PREFIX = process.env.GLOBAL_PREFIX || 'api';

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);

  /// cors
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Comic')
    .setDescription('The Comic API description')
    .setVersion('1.0')
    .addTag('Comic')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  /// validate pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => {
    Logger.log(`Listening on port: http://localhost:${PORT}/${GLOBAL_PREFIX}`);
  });
}

bootstrap();
