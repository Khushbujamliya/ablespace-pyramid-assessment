import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: ['http://localhost:3001', 'https://ablespace-pyramid-assessment.vercel.app', 'https://ablespace-pyramid-assessment-git-main-khushbu-jamliyas-projects.vercel.app',
      'https://ablespace-pyramid-assessment-nlu2vtewe.vercel.app',],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
