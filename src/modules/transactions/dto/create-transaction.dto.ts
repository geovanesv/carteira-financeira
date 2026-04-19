import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 2, description: 'ID do usuário beneficiário' })
  @IsInt()
  payeeId: number;

  @ApiProperty({ example: 100.00, description: 'Valor da transação' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;
}