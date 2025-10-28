import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletRepository } from '../repositories/wallet.repository';
import { BalanceDto } from '../dto/balance.dto';

@Injectable()
export class GetBalanceUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(userId: number): Promise<BalanceDto> {
    const wallet = await this.walletRepository.findOne({ where: { userId } });

    if (!wallet) {
      throw new NotFoundException('Wallet not found.');
    }

    return { balance: wallet.balance };
  }
}