import { UserEntity } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('wallets')
export class WalletEntity {
  @ApiProperty({ description: 'O ID único da carteira', example: 1 })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @ApiProperty({ description: 'O ID do usuário dono da carteira', example: 1 })
  @Column({ name: 'user_id', unique: true, type: 'int' })
  userId: number;

  @ApiProperty({ description: 'O saldo atual da carteira', example: 542.75 })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      from: (value: string) => parseFloat(value),
      to: (value: number) => value,
    },
  })
  balance: number;

  @ApiProperty({ description: 'Data de criação da carteira' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização da carteira' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({
    type: () => UserEntity,
    description: 'Usuário associado à carteira',
  })
  @OneToOne(() => UserEntity, (user) => user.wallet)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
