import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { PREFIX } from './commons/constants';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const docsConfig = new DocumentBuilder()
    .setTitle('waynehills subject')
    .setDescription('웨인힐즈 과제')
    .setVersion('1.0')
    .addCookieAuth(
      'auth-cookie',
      {
        type: 'http',
        in: 'Header',
        scheme: 'Bearer',
      },
      'accessToken',
    )
    .addCookieAuth(
      'auth-cookie',
      {
        type: 'http',
        in: 'Header',
        scheme: 'Bearer',
      },
      'refreshToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, docsConfig);

  SwaggerModule.setup(`${PREFIX}/docs`, app, document);

  app.use(cookieParser());

  await app.listen(PORT, () => {
    console.log(`server run on http://localhost:${PORT}${PREFIX}`);
    console.log(`api docs run on http://localhost:${PORT}${PREFIX}/docs`);
  });
}
bootstrap();
