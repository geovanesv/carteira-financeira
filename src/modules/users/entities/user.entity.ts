import { WalletEntity } from '../../wallets/entities/wallet.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column()
  name: string;

  @Column({ name: 'email', type: 'varchar', unique: true })
  email: string;

  @Column()
  password?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => WalletEntity, (wallet) => wallet.user)
  wallet: WalletEntity;
}
