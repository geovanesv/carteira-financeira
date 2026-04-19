import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '../../infrastructure/data/repositories/transaction.repository';
import { WalletRepository } from '../../../wallets/infrastructure/data/repositories/wallet.repository';
import { TransactionEntity } from '../../entities/transaction.entity';

@Injectable()
export class ListTransactionsUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(userId: number): Promise<TransactionEntity[]> {
    const wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada.');
    }

    return this.transactionRepository.findByWalletId(wallet.id);
  }
}
