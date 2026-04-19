import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { TransactionEntity } from '../../../entities/transaction.entity';

@Injectable()
export class TransactionRepository extends Repository<TransactionEntity> {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(TransactionEntity, entityManager);
  }

  async findById(id: number): Promise<TransactionEntity | null> {
    return this.findOne({ where: { id } });
  }

  async findByWalletId(walletId: number): Promise<TransactionEntity[]> {
    return this.find({
      where: [{ payerWalletId: walletId }, { payeeWalletId: walletId }],
      order: { id: 'DESC' },
    });
  }
}
