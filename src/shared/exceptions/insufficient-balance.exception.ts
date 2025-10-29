import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientBalanceException extends HttpException {
  constructor() {
    super('Insufficient balance for this transaction.', HttpStatus.BAD_REQUEST);
  }
}