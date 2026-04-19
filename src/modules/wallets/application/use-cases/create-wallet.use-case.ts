import { Injectable, ConflictException } from '@nestjs/common';
import { WalletRepository } from '../../infrastructure/data/repositories/wallet.repository';

@Injectable()
export class CreateWalletUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(userId: number): Promise<void> {
    const existingWallet = await this.walletRepository.findByUserId(userId);

    if (existingWallet) {
      throw new ConflictException('O usuário já possui uma carteira.');
    }

    await this.walletRepository.create({
      userId,
      balance: 0,
    });
  }
}
