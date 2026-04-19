import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletRepository } from '../../infrastructure/data/repositories/wallet.repository';
import { WalletEntity } from '../../entities/wallet.entity';

@Injectable()
export class GetBalanceUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(userId: number): Promise<WalletEntity> {
    const wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada.');
    }

    return wallet;
  }
}
