import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';

import { AppModule } from './modules';
import { configService } from './config';

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

  // /// firebase
  // admin.initializeApp(configService.getFirebaseConfig());

  /// validate pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => {
    Logger.log(`Listening on port: http://localhost:${PORT}/${GLOBAL_PREFIX}`);
  });
}

bootstrap();
