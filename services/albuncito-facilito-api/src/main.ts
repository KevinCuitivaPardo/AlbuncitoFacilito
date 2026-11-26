import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // El frontend corre en otro origen
  app.enableCors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' });
  // Puerto 3001 por defecto para no chocar con el frontend (3000)
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
