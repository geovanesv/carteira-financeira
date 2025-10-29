import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { WalletRepository } from '../../wallets/repositories/wallet.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { InsufficientBalanceException } from '../../../shared/exceptions/insufficient-balance.exception';
import { BusinessException } from '../../../shared/exceptions/business.exception';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(
    payerId: number,
    createTransactionDto: CreateTransactionDto,
  ): Promise<any> {
    const { payeeId, amount } = createTransactionDto;

    if (payerId === payeeId) {
      throw new BusinessException(
        'O pagador e o beneficiário não podem ser a mesma pessoa.',
      );
    }

    const payerWallet = await this.walletRepository.findOne({
      where: { userId: payerId },
    });
    const payeeWallet = await this.walletRepository.findOne({
      where: { userId: payeeId },
    });

    if (!payerWallet || !payeeWallet) {
      throw new NotFoundException(
        'Carteira do pagador ou beneficiário não encontrada.',
      );
    }

    if (payerWallet.balance < amount) {
      throw new InsufficientBalanceException();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      payerWallet.balance = Number(payerWallet.balance) - amount;
      payeeWallet.balance = Number(payeeWallet.balance) + amount;

      await queryRunner.manager.save(payerWallet);
      await queryRunner.manager.save(payeeWallet);

      const transaction = this.transactionRepository.create({
        payerWalletId: payerWallet.id,
        payeeWalletId: payeeWallet.id,
        amount,
        status: 'completo',
      });

      const savedTransaction = await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      return savedTransaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BusinessException('Transaction failed. Please try again.');
    } finally {
      await queryRunner.release();
    }
  }
}
