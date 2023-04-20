import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './pipes/validation.pipe';
import cookieParser from 'cookie-parser';
import * as process from "process";

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: process.env.CLIENT_URL,
    credentials: true
  });

  const config = new DocumentBuilder()
    .setTitle('Blog platform')
    .setDescription('Rest Api documentation')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => console.log(`server started on port ${PORT}`));
}

start();
