import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';
import { WalletRepository } from '../../../wallets/infrastructure/data/repositories/wallet.repository';
import { TransactionRepository } from '../../infrastructure/data/repositories/transaction.repository';
import { InsufficientBalanceException } from '../../../../shared/exceptions/insufficient-balance.exception';
import { BusinessException } from '../../../../shared/exceptions/business.exception';

export interface CreateTransactionResponse {
  id: number;
  payerWalletId: number;
  payeeWalletId: number;
  amount: number;
  status: string;
  createdAt: Date;
}

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
  ): Promise<CreateTransactionResponse> {
    const { payeeId, amount } = createTransactionDto;

    if (payerId === payeeId) {
      throw new BusinessException(
        'O pagador e o beneficiário não podem ser a mesma pessoa.',
      );
    }

    if (amount <= 0) {
      throw new BadRequestException('O valor deve ser maior que zero.');
    }

    const payerWallet = await this.walletRepository.findByUserId(payerId);
    const payeeWallet = await this.walletRepository.findByUserId(payeeId);

    if (!payerWallet || !payeeWallet) {
      throw new NotFoundException(
        'Carteira do pagador ou beneficiário não encontrada.',
      );
    }

    if (payerWallet.balance < amount) {
      throw new InsufficientBalanceException();
    }

    return this.executeTransaction(payerWallet, payeeWallet, amount);
  }

  private async executeTransaction(
    payerWallet: any,
    payeeWallet: any,
    amount: number,
  ): Promise<CreateTransactionResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      payerWallet.balance = Number(payerWallet.balance) - amount;
      payeeWallet.balance = Number(payeeWallet.balance) + amount;

      await queryRunner.manager.save(payerWallet);
      await queryRunner.manager.save(payeeWallet);

      const transaction = await this.transactionRepository.create({
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
      throw new BusinessException('A transação falhou. Tente novamente.');
    } finally {
      await queryRunner.release();
    }
  }
}
