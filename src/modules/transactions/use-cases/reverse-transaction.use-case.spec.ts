import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, QueryRunner } from 'typeorm';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';

import { ReverseTransactionUseCase } from './reverse-transaction.use-case';
import { WalletRepository } from '../../wallets/repositories/wallet.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { WalletEntity } from '../../wallets/entities/wallet.entity';
import { TransactionEntity } from '../entities/transaction.entity';

describe('ReverseTransactionUseCase', () => {
  let useCase: ReverseTransactionUseCase;
  let walletRepository: DeepMocked<WalletRepository>;
  let transactionRepository: DeepMocked<TransactionRepository>;
  let dataSource: DeepMocked<DataSource>;
  let queryRunner: DeepMocked<QueryRunner>;

  beforeEach(async () => {
    queryRunner = createMock<QueryRunner>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ReverseTransactionUseCase],
    })
      .useMocker(createMock)
      .compile();

    useCase = module.get<ReverseTransactionUseCase>(ReverseTransactionUseCase);
    walletRepository = module.get(WalletRepository);
    transactionRepository = module.get(TransactionRepository);
    dataSource = module.get(DataSource);

    dataSource.createQueryRunner.mockReturnValue(queryRunner);
  });

  it('deve ser definido', () => {
    expect(useCase).toBeDefined();
  });

  it('deve lançar NotFoundException se a transação não for encontrada', async () => {
    transactionRepository.findOne.mockResolvedValue(null);
    await expect(useCase.execute(1, 1)).rejects.toThrow(
      new NotFoundException('Transação não encontrada.'),
    );
  });

  it('deve lançar BusinessException se a transação já foi revertida', async () => {
    const transaction = { status: 'revertido' } as TransactionEntity;
    transactionRepository.findOne.mockResolvedValue(transaction);
    await expect(useCase.execute(1, 1)).rejects.toThrow(
      new BusinessException('A transação já foi revertida.'),
    );
  });

  it('deve lançar NotFoundException se as carteiras não forem encontradas', async () => {
    const transaction = { status: 'completo' } as TransactionEntity;
    transactionRepository.findOne.mockResolvedValue(transaction);
    walletRepository.findOne.mockResolvedValue(null);
    await expect(useCase.execute(1, 1)).rejects.toThrow(
      new NotFoundException(
        'Carteira do pagador ou beneficiário não encontrada.',
      ),
    );
  });

  it('deve lançar BusinessException se o solicitante não for o pagador', async () => {
    const transaction = {
      status: 'completo',
      payerWalletId: 1,
    } as TransactionEntity;
    const payerWallet = { userId: 2 } as WalletEntity; // Different user
    transactionRepository.findOne.mockResolvedValue(transaction);
    walletRepository.findOne.mockResolvedValueOnce(payerWallet);
    await expect(useCase.execute(1, 1)).rejects.toThrow(
      new BusinessException('Somente o pagador pode reverter a transação.'),
    );
  });

  it('deve lançar BusinessException se o beneficiário não tiver saldo suficiente', async () => {
    const transaction = {
      status: 'completo',
      payerWalletId: 1,
      payeeWalletId: 2,
      amount: 100,
    } as TransactionEntity;
    const payerWallet = { userId: 1 } as WalletEntity;
    const payeeWallet = { balance: 50 } as WalletEntity; // Insufficient balance
    transactionRepository.findOne.mockResolvedValue(transaction);
    walletRepository.findOne
      .mockResolvedValueOnce(payerWallet)
      .mockResolvedValueOnce(payeeWallet);
    await expect(useCase.execute(1, 1)).rejects.toThrow(
      new BusinessException(
        'O beneficiário não tem saldo suficiente para reverter a transação.',
      ),
    );
  });

  it('deve reverter uma transação com sucesso', async () => {
    const transaction = {
      id: 1,
      status: 'completo',
      payerWalletId: 1,
      payeeWalletId: 2,
      amount: 100,
    } as TransactionEntity;
    const payerWallet = { id: 1, userId: 1, balance: 100 } as WalletEntity;
    const payeeWallet = { id: 2, userId: 2, balance: 200 } as WalletEntity;

    transactionRepository.findOne.mockResolvedValue(transaction);
    walletRepository.findOne
      .mockResolvedValueOnce(payerWallet)
      .mockResolvedValueOnce(payeeWallet);

    const result = await useCase.execute(1, 1);

    expect(result).toEqual({ message: 'Transação revertida com sucesso.' });
    expect(queryRunner.commitTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();

    const expectedPayerWallet = { ...payerWallet, balance: 200 };
    const expectedPayeeWallet = { ...payeeWallet, balance: 100 };
    const expectedTransaction = { ...transaction, status: 'revertido' };

    expect(queryRunner.manager.save).toHaveBeenCalledWith([
      expectedPayerWallet,
      expectedPayeeWallet,
      expectedTransaction,
    ]);
  });

  it('deve fazer rollback em caso de falha', async () => {
    const transaction = {
      id: 1,
      status: 'completo',
      payerWalletId: 1,
      payeeWalletId: 2,
      amount: 100,
    } as TransactionEntity;
    const payerWallet = { id: 1, userId: 1, balance: 100 } as WalletEntity;
    const payeeWallet = { id: 2, userId: 2, balance: 200 } as WalletEntity;

    transactionRepository.findOne.mockResolvedValue(transaction);
    walletRepository.findOne
      .mockResolvedValueOnce(payerWallet)
      .mockResolvedValueOnce(payeeWallet);

    (queryRunner.manager.save as jest.Mock).mockRejectedValue(
      new Error('DB Error'),
    );

    await expect(useCase.execute(1, 1)).rejects.toThrow(
      new BusinessException('A reversão da transação falhou.'),
    );

    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });
});
