import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  payeeId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;
}
