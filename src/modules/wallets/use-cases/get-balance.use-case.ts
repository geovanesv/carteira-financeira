import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletRepository } from '../repositories/wallet.repository';
import { BalanceDto } from '../dto/balance.dto';

@Injectable()
export class GetBalanceUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(userId: number) {
    const wallet = await this.walletRepository.findOneBy({ userId });

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada.');
    }

    return wallet;
  }

  async getAllWallets() {
    return this.walletRepository.find();
  }
}
