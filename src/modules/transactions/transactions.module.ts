import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './adapters/controllers/transactions.controller';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionRepository } from './infrastructure/data/repositories/transaction.repository';
import { TransactionDomainService } from './domain/services/transaction.domain.service';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { WalletsModule } from '../wallets/wallets.module';
import { AuthModule } from '../auth/auth.module';
import { ListTransactionsUseCase } from './application/use-cases/list-transactions.use-case';
import { ReverseTransactionUseCase } from './application/use-cases/reverse-transaction.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    WalletsModule,
    AuthModule,
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionRepository,
    TransactionDomainService,
    CreateTransactionUseCase,
    ListTransactionsUseCase,
    ReverseTransactionUseCase,
  ],
  exports: [TransactionRepository],
})
export class TransactionsModule {}
