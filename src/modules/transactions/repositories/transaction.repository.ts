import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository extends Repository<TransactionEntity> {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(TransactionEntity, entityManager);
  }
}