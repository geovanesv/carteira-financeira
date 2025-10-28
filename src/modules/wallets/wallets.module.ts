import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsController } from './wallets.controller';
import { WalletEntity } from './entities/wallet.entity';
import { WalletRepository } from './repositories/wallet.repository';
import { GetBalanceUseCase } from './use-cases/get-balance.use-case';
import { CreateWalletUseCase } from './use-cases/create-wallet.use-case';
import { AuthModule } from '../auth/auth.module';
import { UpdateWalletUseCase } from './use-cases/updated-wallet.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [WalletsController],
  providers: [
    WalletRepository,
    GetBalanceUseCase,
    CreateWalletUseCase,
    UpdateWalletUseCase,
  ],
  exports: [
    WalletRepository,
    CreateWalletUseCase,
    GetBalanceUseCase,
    UpdateWalletUseCase,
  ],
})
export class WalletsModule {}
