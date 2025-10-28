import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import { WalletEntity } from './entities/wallet.entity';

@ApiTags('wallets')
@ApiBearerAuth() // Aplica a autenticação Bearer a todas as rotas do controller
@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly getBalanceUseCase: GetBalanceUseCase,
    private readonly createWalletUseCase: CreateWalletUseCase,
    private readonly updateWalletUseCase: UpdateWalletUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  @ApiOperation({ summary: 'Obtém o saldo da carteira do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Saldo retornado com sucesso.',
    type: WalletEntity,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  getBalance(@Request() req) {
    const userId = req.user.id;
    return this.getBalanceUseCase.execute(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Cria uma carteira para o usuário autenticado' })
  @ApiResponse({
    status: 201,
    description: 'Carteira criada com sucesso.',
    type: WalletEntity,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 409, description: 'Usuário já possui uma carteira.' })
  create(@Request() req) {
    const userId = req.user.id;
    return this.createWalletUseCase.execute(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @ApiOperation({ summary: 'Adiciona ou remove valor do saldo da carteira' })
  @ApiResponse({ status: 200, description: 'Saldo atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 400, description: 'Valor inválido.' })
  update(@Request() req, @Body() updateWalletDto: BalanceDto) {
    const userId = req.user.id;
    return this.updateWalletUseCase.execute(userId, updateWalletDto.balance);
  }
}
