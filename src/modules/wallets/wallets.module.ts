import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsController } from './adapters/controllers/wallets.controller';
import { WalletEntity } from './entities/wallet.entity';
import { WalletRepository } from './infrastructure/data/repositories/wallet.repository';
import { WalletDomainService } from './domain/services/wallet.domain.service';
import { GetBalanceUseCase } from './application/use-cases/get-balance.use-case';
import { CreateWalletUseCase } from './application/use-cases/create-wallet.use-case';
import { AuthModule } from '../auth/auth.module';
import { UpdateWalletUseCase } from './application/use-cases/update-wallet.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [WalletsController],
  providers: [
    WalletRepository,
    WalletDomainService,
    GetBalanceUseCase,
    CreateWalletUseCase,
    UpdateWalletUseCase,
  ],
  exports: [
    WalletRepository,
    CreateWalletUseCase,
    GetBalanceUseCase,
    UpdateWalletUseCase,
    WalletDomainService,
  ],
})
export class WalletsModule {}
