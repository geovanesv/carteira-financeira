import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransactionRepository } from '../repositories/transaction.repository';
import { WalletRepository } from '../../wallets/repositories/wallet.repository';
import { BusinessException } from '../../../shared/exceptions/business.exception';

@Injectable()
export class ReverseTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(transactionId: number, requesterId: number): Promise<any> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }

    if (transaction.status === 'reversed') {
      throw new BusinessException('Transaction has already been reversed.');
    }

    const payerWallet = await this.walletRepository.findOne({
      where: { id: transaction.payerWalletId },
    });
    const payeeWallet = await this.walletRepository.findOne({
      where: { id: transaction.payeeWalletId },
    });

    if (!payerWallet || !payeeWallet) {
      throw new NotFoundException('Payer or payee wallet not found.');
    }

    if (requesterId !== payerWallet.userId) {
      throw new BusinessException(
        'Only the payer can reverse the transaction.',
      );
    }

    if (payeeWallet.balance < transaction.amount) {
      throw new BusinessException(
        'Payee does not have enough balance to reverse the transaction.',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      payerWallet.balance = Number(payerWallet.balance) + transaction.amount;
      payeeWallet.balance = Number(payeeWallet.balance) - transaction.amount;
      transaction.status = 'reversed';

      await queryRunner.manager.save([payerWallet, payeeWallet, transaction]);
      await queryRunner.commitTransaction();

      return { message: 'Transaction reversed successfully.' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BusinessException('Transaction reversal failed.');
    } finally {
      await queryRunner.release();
    }
  }
}
