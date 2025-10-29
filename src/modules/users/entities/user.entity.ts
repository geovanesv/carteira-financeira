import { WalletEntity } from '../../wallets/entities/wallet.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity('users')
export class UserEntity {
  @ApiProperty({ description: 'O ID único do usuário', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @ApiProperty({ description: 'O nome do usuário', example: 'João da Silva' })
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @ApiProperty({
    description: 'O e-mail único do usuário',
    example: 'joao.silva@example.com',
  })
  @Column({ name: 'email', type: 'varchar', unique: true })
  email: string;

  @ApiHideProperty()
  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => WalletEntity, (wallet) => wallet.user)
  wallet: WalletEntity;
}
