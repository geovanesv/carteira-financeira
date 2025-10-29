import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletRepository } from '../repositories/wallet.repository';

@Injectable()
export class UpdateWalletUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(userId: number, amount: number) {
    const wallet = await this.walletRepository.findOne({ where: { userId } });

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada.');
    }

    wallet.balance += amount;

    const updatedWallet = await this.walletRepository.save(wallet);

    return updatedWallet;
  }
}
