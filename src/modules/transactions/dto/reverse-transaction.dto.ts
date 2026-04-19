import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ReverseTransactionDto {
  @ApiProperty({ example: 1, description: 'ID da transação a ser revertida' })
  @IsInt()
  transactionId: number;
}