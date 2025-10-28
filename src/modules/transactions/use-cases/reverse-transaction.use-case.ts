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
      throw new NotFoundException('Transação não encontrada.');
    }

    if (transaction.status === 'revertido') {
      throw new BusinessException('A transação já foi revertida.');
    }

    const payerWallet = await this.walletRepository.findOne({
      where: { id: transaction.payerWalletId },
    });
    const payeeWallet = await this.walletRepository.findOne({
      where: { id: transaction.payeeWalletId },
    });

    if (!payerWallet || !payeeWallet) {
      throw new NotFoundException(
        'Carteira do pagador ou beneficiário não encontrada.',
      );
    }

    if (requesterId !== payerWallet.userId) {
      throw new BusinessException(
        'Somente o pagador pode reverter a transação.',
      );
    }

    if (payeeWallet.balance < transaction.amount) {
      throw new BusinessException(
        'O beneficiário não tem saldo suficiente para reverter a transação.',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      payerWallet.balance = Number(payerWallet.balance) + transaction.amount;
      payeeWallet.balance = Number(payeeWallet.balance) - transaction.amount;
      transaction.status = 'revertido';

      await queryRunner.manager.save([payerWallet, payeeWallet, transaction]);
      await queryRunner.commitTransaction();

      return { message: 'Transação revertida com sucesso.' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BusinessException('A reversão da transação falhou.');
    } finally {
      await queryRunner.release();
    }
  }
}
