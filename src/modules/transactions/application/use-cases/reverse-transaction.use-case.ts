import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransactionRepository } from '../../infrastructure/data/repositories/transaction.repository';
import { WalletRepository } from '../../../wallets/infrastructure/data/repositories/wallet.repository';
import { BusinessException } from '../../../../shared/exceptions/business.exception';

export interface ReverseTransactionResponse {
  message: string;
  transaction: {
    id: number;
    status: string;
  };
}

@Injectable()
export class ReverseTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(
    transactionId: number,
    requesterId: number,
  ): Promise<ReverseTransactionResponse> {
    const transaction =
      await this.transactionRepository.findById(transactionId);

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada.');
    }

    if (transaction.status === 'revertido') {
      throw new BusinessException('A transação já foi revertida.');
    }

    const payerWallet = await this.walletRepository.findById(
      transaction.payerWalletId,
    );
    const payeeWallet = await this.walletRepository.findById(
      transaction.payeeWalletId,
    );

    if (!payerWallet || !payeeWallet) {
      throw new NotFoundException(
        'Carteira do pagador ou beneficiário não encontrada.',
      );
    }

    if (requesterId !== payerWallet.userId) {
      throw new ForbiddenException(
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

      return {
        message: 'Transação revertida com sucesso.',
        transaction: {
          id: transaction.id,
          status: transaction.status,
        },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BusinessException('A reversão da transação falhou.');
    } finally {
      await queryRunner.release();
    }
  }
}
