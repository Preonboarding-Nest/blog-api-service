import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const prefix = '/api/v1';

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(prefix);

  app.useGlobalPipes(new ValidationPipe());

  const docsConfig = new DocumentBuilder()
    .setTitle('waynehills subject')
    .setDescription('웨인힐즈 과제')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, docsConfig);

  SwaggerModule.setup(`${prefix}/docs`, app, document);

  app.use(cookieParser());

  await app.listen(PORT, () => {
    console.log(`server run on http://localhost:${PORT}${prefix}`);
    console.log(`api docs run on http://localhost:${PORT}${prefix}/docs`);
  });
}
bootstrap();
