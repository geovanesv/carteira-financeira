import { Injectable } from '@nestjs/common';
import { TransactionEntity } from '../../entities/transaction.entity';
import { TransactionRepository } from '../../infrastructure/data/repositories/transaction.repository';
import { WalletEntity } from '../../../wallets/entities/wallet.entity';

export enum TransactionStatus {
  COMPLETE = 'completo',
  REVERSED = 'revertido',
}

@Injectable()
export class TransactionDomainService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  canReverse(transaction: TransactionEntity, requesterId: number): boolean {
    return (
      transaction.payerWalletId === requesterId &&
      transaction.status !== TransactionStatus.REVERSED
    );
  }

  createTransaction(
    payerWallet: WalletEntity,
    payeeWallet: WalletEntity,
    amount: number,
  ): Partial<TransactionEntity> {
    return {
      payerWalletId: payerWallet.id,
      payeeWalletId: payeeWallet.id,
      amount,
      status: TransactionStatus.COMPLETE,
    };
  }
}
