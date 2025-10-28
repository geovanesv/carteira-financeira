import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { GetBalanceUseCase } from './use-cases/get-balance.use-case';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly getBalanceUseCase: GetBalanceUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  getBalance(@Request() req) {
    // O ID do usuário é extraído do token JWT pelo JwtAuthGuard
    const userId = req.user.id;
    return this.getBalanceUseCase.execute(userId);
  }
}