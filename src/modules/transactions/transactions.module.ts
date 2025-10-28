import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionRepository } from './repositories/transaction.repository';
import { CreateTransactionUseCase } from './use-cases/create-transaction.use-case';
import { WalletsModule } from '../wallets/wallets.module';
import { AuthModule } from '../auth/auth.module';
import { ListTransactionsUseCase } from './use-cases/list-transactions.use-case';
import { ReverseTransactionUseCase } from './use-cases/reverse-transaction.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), WalletsModule, AuthModule],
  controllers: [TransactionsController],
  providers: [
    TransactionRepository,
    CreateTransactionUseCase,
    ListTransactionsUseCase,
    ReverseTransactionUseCase,
  ],
})
export class TransactionsModule {}