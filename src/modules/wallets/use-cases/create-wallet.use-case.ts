import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../repositories/wallet.repository';

@Injectable()
export class CreateWalletUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(userId: number): Promise<void> {
    const wallet = this.walletRepository.create({
      userId,
      balance: 0,
    });

    await this.walletRepository.save(wallet);
  }

  async create(userId: number, balance: number) {
    const wallet = this.walletRepository.create({
      userId,
      balance,
    });
    return await this.walletRepository.save(wallet);
  }
}
