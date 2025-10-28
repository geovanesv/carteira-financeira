import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { AuthModule } from './modules/auth/auth.module';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import { AppDataSource } from './db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        ...AppDataSource.options,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    WalletsModule,
    TransactionsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
