import { Controller, Post, Body, UseGuards, Request, Get, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionUseCase } from './use-cases/create-transaction.use-case';
import { ListTransactionsUseCase } from './use-cases/list-transactions.use-case';
import { ReverseTransactionDto } from './dto/reverse-transaction.dto';
import { ReverseTransactionUseCase } from './use-cases/reverse-transaction.use-case';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly listTransactionsUseCase: ListTransactionsUseCase,
    private readonly reverseTransactionUseCase: ReverseTransactionUseCase,
  ) {}

  @Post()
  create(@Request() req, @Body() createTransactionDto: CreateTransactionDto) {
    const payerId = req.user.id;
    return this.createTransactionUseCase.execute(payerId, createTransactionDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.listTransactionsUseCase.execute(req.user.id);
  }

  @Patch('reverse')
  reverse(@Request() req, @Body() reverseDto: ReverseTransactionDto) {
    return this.reverseTransactionUseCase.execute(reverseDto.transactionId, req.user.id);
  }
}