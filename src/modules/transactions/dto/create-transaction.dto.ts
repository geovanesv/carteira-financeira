import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  payeeId: number; // ID do usuário que receberá

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;
}
