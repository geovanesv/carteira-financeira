import { Injectable } from '@nestjs/common';
import { WalletEntity } from '../../entities/wallet.entity';
import { WalletRepository } from '../../infrastructure/data/repositories/wallet.repository';
import { Money } from '../../../../shared/value-objects/money.value-object';

@Injectable()
export class WalletDomainService {
  constructor(private readonly walletRepository: WalletRepository) {}

  async getBalance(userId: number): Promise<WalletEntity> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new Error('Carteira não encontrada.');
    }
    return wallet;
  }

  async addBalance(
    wallet: WalletEntity,
    amount: number,
  ): Promise<WalletEntity> {
    const currentBalance = new Money(wallet.balance);
    const amountMoney = new Money(amount);
    const newBalance = currentBalance.add(amountMoney);
    wallet.balance = newBalance.value;
    return this.walletRepository.save(wallet);
  }

  async subtractBalance(
    wallet: WalletEntity,
    amount: number,
  ): Promise<WalletEntity> {
    const currentBalance = new Money(wallet.balance);
    const amountMoney = new Money(amount);

    if (currentBalance.isLessThan(amountMoney)) {
      throw new Error('Saldo insuficiente.');
    }

    const newBalance = currentBalance.subtract(amountMoney);
    wallet.balance = newBalance.value;
    return this.walletRepository.save(wallet);
  }

  async hasEnoughBalance(
    wallet: WalletEntity,
    amount: number,
  ): Promise<boolean> {
    const currentBalance = new Money(wallet.balance);
    const amountMoney = new Money(amount);
    return (
      currentBalance.isGreaterThan(amountMoney) ||
      currentBalance.equals(amountMoney)
    );
  }
}
