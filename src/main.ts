import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o ValidationPipe globalmente para validar DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão no DTO
      forbidNonWhitelisted: true, // Lança erro se propriedades extras forem enviadas
      transform: true, // Transforma os tipos de dados (ex: string para number)
    }),
  );

  // Configuração do Swagger com mais detalhes
  const config = new DocumentBuilder()
    .setTitle('Carteira Financeira API')
    .setDescription('Documentação da API para o projeto de Carteira Financeira')
    .setContact(
      'Geovane',
      'https://github.com/geovanesv',
      'seu-email@exemplo.com',
    )
    .setVersion('1.0')
    .addTag('auth', 'Operações de autenticação')
    .addTag('users', 'Operações relacionadas a usuários')
    .addTag('wallets', 'Operações relacionadas a carteiras')
    .addBearerAuth() // Habilita o input para o token JWT no Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Cria a rota para servir a documentação
  // A rota será /api-docs
  SwaggerModule.setup('api-docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;

  await app.listen(port);
}
bootstrap();
