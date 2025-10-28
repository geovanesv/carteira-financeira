import { Type } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsNumber } from 'class-validator';

export class BalanceDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  balance: number;
}
