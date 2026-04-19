import { TransactionEntity } from '../../entities/transaction.entity';

export interface ITransactionRepository {
  findById(id: number): Promise<TransactionEntity | null>;
  findByWalletId(walletId: number): Promise<TransactionEntity[]>;
  create(transaction: Partial<TransactionEntity>): Promise<TransactionEntity>;
  save(transaction: TransactionEntity): Promise<TransactionEntity>;
}
