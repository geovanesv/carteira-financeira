import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { WalletRepository } from '../../wallets/repositories/wallet.repository';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class ListTransactionsUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(userId: number): Promise<TransactionEntity[]> {
    const wallet = await this.walletRepository.findOneOrFail({
      where: { userId },
    });
    return this.transactionRepository.find({
      where: [{ payerWalletId: wallet.id }, { payeeWalletId: wallet.id }],
      order: { id: 'DESC' },
    });
  }
}
