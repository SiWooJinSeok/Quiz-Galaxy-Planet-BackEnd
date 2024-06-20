import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에서 데코레이터가 없는 속성을 제거
      forbidNonWhitelisted: true, // 화이트리스트에 없는 속성이 포함된 경우 요청을 거부
      transform: true, // 요청에서 넘어온 데이터를 DTO의 타입으로 변환}
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Quiz Galaxy Planet')
    .setDescription('Quiz Galaxy Planet API 입니다. 🚀')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
