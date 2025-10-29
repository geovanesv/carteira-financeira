import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionUseCase } from './use-cases/create-transaction.use-case';
import { ListTransactionsUseCase } from './use-cases/list-transactions.use-case';
import { ReverseTransactionDto } from './dto/reverse-transaction.dto';
import { ReverseTransactionUseCase } from './use-cases/reverse-transaction.use-case';
import { TransactionEntity } from './entities/transaction.entity';

@ApiTags('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly listTransactionsUseCase: ListTransactionsUseCase,
    private readonly reverseTransactionUseCase: ReverseTransactionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova transação' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso.',
    type: TransactionEntity,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou saldo insuficiente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Carteira de destino não encontrada.',
  })
  create(@Request() req, @Body() createTransactionDto: CreateTransactionDto) {
    const payerId = req.user.id;
    return this.createTransactionUseCase.execute(payerId, createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as transações do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de transações retornada com sucesso.',
    type: [TransactionEntity],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll(@Request() req) {
    return this.listTransactionsUseCase.execute(req.user.id);
  }

  @Patch('reverse')
  @ApiOperation({ summary: 'Reverte uma transação específica' })
  @ApiBody({ type: ReverseTransactionDto })
  @ApiResponse({ status: 200, description: 'Transação revertida com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada.' })
  @ApiResponse({
    status: 403,
    description: 'Usuário não autorizado a reverter esta transação.',
  })
  reverse(@Request() req, @Body() reverseDto: ReverseTransactionDto) {
    return this.reverseTransactionUseCase.execute(
      reverseDto.transactionId,
      req.user.id,
    );
  }
}
