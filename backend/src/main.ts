import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
  cors({
    origin: [
      'https://bookfair-stall-reservation-app.vercel.app',
      'http://localhost:5173',
    ],
    credentials: true,
  })
);

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(5000);
  console.log('🚀 Server running on http://localhost:5000');
}
bootstrap();
