import { IsInt } from 'class-validator';

export class ReverseTransactionDto {
  @IsInt()
  transactionId: number;
}