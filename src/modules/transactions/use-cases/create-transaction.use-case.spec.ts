import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, QueryRunner } from 'typeorm';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';

import { CreateTransactionUseCase } from './create-transaction.use-case';
import { WalletRepository } from '../../wallets/repositories/wallet.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { InsufficientBalanceException } from '../../../shared/exceptions/insufficient-balance.exception';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { WalletEntity } from '../../wallets/entities/wallet.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let walletRepository: DeepMocked<WalletRepository>;
  let transactionRepository: DeepMocked<TransactionRepository>;
  let dataSource: DeepMocked<DataSource>;
  let queryRunner: DeepMocked<QueryRunner>;

  beforeEach(async () => {
    queryRunner = createMock<QueryRunner>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateTransactionUseCase],
    })
      .useMocker(createMock)
      .compile();

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    walletRepository = module.get(WalletRepository);
    transactionRepository = module.get(TransactionRepository);
    dataSource = module.get(DataSource);

    dataSource.createQueryRunner.mockReturnValue(queryRunner);
  });

  it('deve ser definido', () => {
    expect(useCase).toBeDefined();
  });

  it('deve lançar BusinessException se o pagador e o beneficiário forem os mesmos', async () => {
    const payerId = 1;
    const createTransactionDto: CreateTransactionDto = {
      payeeId: 1,
      amount: 100,
    };

    await expect(
      useCase.execute(payerId, createTransactionDto),
    ).rejects.toThrow(
      new BusinessException(
        'O pagador e o beneficiário não podem ser a mesma pessoa.',
      ),
    );
  });

  it('deve lançar NotFoundException se a carteira do pagador ou do beneficiário não existir', async () => {
    const payerId = 1;
    const createTransactionDto: CreateTransactionDto = {
      payeeId: 2,
      amount: 100,
    };

    walletRepository.findOne.mockResolvedValue(null);

    await expect(
      useCase.execute(payerId, createTransactionDto),
    ).rejects.toThrow(
      new NotFoundException(
        'Carteira do pagador ou beneficiário não encontrada.',
      ),
    );
  });

  it('deve lançar InsufficientBalanceException se o pagador não tiver saldo suficiente', async () => {
    const payerId = 1;
    const createTransactionDto: CreateTransactionDto = {
      payeeId: 2,
      amount: 200,
    };

    const payerWallet = { id: 1, userId: 1, balance: 100 } as WalletEntity;
    const payeeWallet = { id: 2, userId: 2, balance: 50 } as WalletEntity;

    walletRepository.findOne
      .mockResolvedValueOnce(payerWallet)
      .mockResolvedValueOnce(payeeWallet);

    await expect(
      useCase.execute(payerId, createTransactionDto),
    ).rejects.toThrow(new InsufficientBalanceException());
  });

  it('deve criar uma transação com sucesso', async () => {
    const payerId = 1;
    const createTransactionDto: CreateTransactionDto = {
      payeeId: 2,
      amount: 100,
    };

    const payerWallet = { id: 1, userId: 1, balance: 200 } as WalletEntity;
    const payeeWallet = { id: 2, userId: 2, balance: 50 } as WalletEntity;

    walletRepository.findOne
      .mockResolvedValueOnce(payerWallet)
      .mockResolvedValueOnce(payeeWallet);

    const savedTransaction = {
      id: 1,
      payerWalletId: 1,
      payeeWalletId: 2,
      amount: 100,
      status: 'completo',
    };

    (queryRunner.manager.save as jest.Mock).mockResolvedValue(savedTransaction);

    const result = await useCase.execute(payerId, createTransactionDto);

    expect(result).toEqual(savedTransaction);
    expect(queryRunner.connect).toHaveBeenCalledTimes(1);
    expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.manager.save).toHaveBeenCalledTimes(3); // payerWallet, payeeWallet, transaction
    expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalledTimes(1);

    // Verifica se os saldos foram atualizados corretamente antes de salvar
    const expectedPayerWallet = { ...payerWallet, balance: 100 };
    const expectedPayeeWallet = { ...payeeWallet, balance: 150 };
    expect(queryRunner.manager.save).toHaveBeenCalledWith(expectedPayerWallet);
    expect(queryRunner.manager.save).toHaveBeenCalledWith(expectedPayeeWallet);
  });

  it('deve reverter a transação em caso de erro', async () => {
    const payerId = 1;
    const createTransactionDto: CreateTransactionDto = {
      payeeId: 2,
      amount: 100,
    };

    const payerWallet = { id: 1, userId: 1, balance: 200 } as WalletEntity;
    const payeeWallet = { id: 2, userId: 2, balance: 50 } as WalletEntity;

    walletRepository.findOne
      .mockResolvedValueOnce(payerWallet)
      .mockResolvedValueOnce(payeeWallet);

    const error = new Error('DB error');
    (queryRunner.manager.save as jest.Mock).mockRejectedValue(error);

    await expect(
      useCase.execute(payerId, createTransactionDto),
    ).rejects.toThrow(
      new BusinessException('Transaction failed. Please try again.'),
    );

    expect(queryRunner.connect).toHaveBeenCalledTimes(1);
    expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.manager.save).toHaveBeenCalled();
    expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
    expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.release).toHaveBeenCalledTimes(1);
  });
});
