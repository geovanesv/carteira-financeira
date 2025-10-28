import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'payer_wallet_id' })
  payerWalletId: number;

  @Column({ name: 'payee_wallet_id' })
  payeeWalletId: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      from: (value: string) => parseFloat(value),
      to: (value: number) => value,
    },
  })
  amount: number;

  @Column()
  status: 'completo' | 'revertido';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
