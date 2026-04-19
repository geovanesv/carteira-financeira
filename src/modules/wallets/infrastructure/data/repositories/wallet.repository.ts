import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { WalletEntity } from '../../../entities/wallet.entity';

@Injectable()
export class WalletRepository extends Repository<WalletEntity> {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(WalletEntity, entityManager);
  }

  async findByUserId(userId: number): Promise<WalletEntity | null> {
    return this.findOne({ where: { userId } });
  }

  async findById(id: number): Promise<WalletEntity | null> {
    return this.findOne({ where: { id } });
  }

  async findAll(): Promise<WalletEntity[]> {
    return this.find();
  }
}
