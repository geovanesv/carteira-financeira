import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class TransactionEntity {
  @ApiProperty({ description: 'O ID único da transação', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID da carteira do pagador', example: 1 })
  @Column({ name: 'payer_wallet_id' })
  payerWalletId: number;

  @ApiProperty({
    description: 'ID da carteira recebedora',
    example: 2,
  })
  @Column({ name: 'payee_wallet_id' })
  payeeWalletId: number;

  @ApiProperty({ description: 'O valor da transação', example: 150.75 })
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

  @ApiProperty({
    description: 'O status da transação',
    example: 'completo',
    enum: ['completo', 'revertido'],
  })
  @Column()
  status: 'completo' | 'revertido';

  @ApiProperty({ description: 'Data de criação da transação' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
