import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { UserEntity } from './modules/users/entities/user.entity';
import { WalletEntity } from './modules/wallets/entities/wallet.entity';
import { TransactionEntity } from './modules/transactions/entities/transaction.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Carteira Financeira API')
    .setDescription('Documentação da API para o projeto de Carteira Financeira')
    .setContact(
      'Geovane',
      'https://github.com/geovanesv',
      'geovane.dev@gmail.com',
    )
    .setVersion('1.0')
    .addTag('auth', 'Operações de autenticação')
    .addTag('users', 'Operações relacionadas a usuários')
    .addTag('wallets', 'Operações relacionadas a carteiras')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [UserEntity, WalletEntity, TransactionEntity],
  });

  SwaggerModule.setup('api-docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;

  await app.listen(port);
}
bootstrap();
