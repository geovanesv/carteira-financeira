import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BalanceDto {
  @ApiProperty({ example: 100.00, description: 'Valor a ser adicionado ou removido' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  balance: number;
}