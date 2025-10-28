import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { WalletEntity } from '../entities/wallet.entity';

@Injectable()
export class WalletRepository extends Repository<WalletEntity> {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(WalletEntity, entityManager);
  }
}