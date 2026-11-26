import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Puerto 3001 por defecto para no chocar con el frontend (3000)
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
