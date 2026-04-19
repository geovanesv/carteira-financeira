import { WalletEntity } from '../../entities/wallet.entity';

export interface IWalletRepository {
  findByUserId(userId: number): Promise<WalletEntity | null>;
  findById(id: number): Promise<WalletEntity | null>;
  findAll(): Promise<WalletEntity[]>;
  create(wallet: Partial<WalletEntity>): Promise<WalletEntity>;
  save(wallet: WalletEntity): Promise<WalletEntity>;
}
