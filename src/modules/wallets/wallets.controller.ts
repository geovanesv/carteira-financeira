import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { GetBalanceUseCase } from './use-cases/get-balance.use-case';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWalletUseCase } from './use-cases/create-wallet.use-case';
import { UpdateWalletUseCase } from './use-cases/updated-wallet.use-case';
import { BalanceDto } from './dto/balance.dto';

@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly getBalanceUseCase: GetBalanceUseCase,
    private readonly createWalletUseCase: CreateWalletUseCase,
    private readonly updateWalletUseCase: UpdateWalletUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  getBalance(@Request() req) {
    const userId = req.user.id;
    return this.getBalanceUseCase.execute(userId);
  }

  @Post('create')
  create(@Request() req) {
    const userId = req.user.id;
    return this.createWalletUseCase.execute(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  update(@Request() req, @Body() updateWalletDto: BalanceDto) {
    const userId = req.user.id;
    return this.updateWalletUseCase.execute(userId, updateWalletDto.balance);
  }
}
