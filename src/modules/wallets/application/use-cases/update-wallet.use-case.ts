import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { WalletRepository } from '../../infrastructure/data/repositories/wallet.repository';
import { WalletEntity } from '../../entities/wallet.entity';

@Injectable()
export class UpdateWalletUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(userId: number, amount: number): Promise<WalletEntity> {
    if (amount === 0) {
      throw new BadRequestException('O valor não pode ser zero.');
    }

    const wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada.');
    }

    wallet.balance += amount;

    return this.walletRepository.save(wallet);
  }
}
