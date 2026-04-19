import { BadRequestException } from '@nestjs/common';

export class Money {
  private readonly _value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new BadRequestException('O valor não pode ser negativo.');
    }
    if (!Number.isFinite(value)) {
      throw new BadRequestException('Valor inválido.');
    }
    this._value = Math.round(value * 100) / 100;
  }

  get value(): number {
    return this._value;
  }

  add(other: Money): Money {
    return new Money(this._value + other._value);
  }

  subtract(other: Money): Money {
    return new Money(this._value - other._value);
  }

  isGreaterThan(other: Money): boolean {
    return this._value > other._value;
  }

  isLessThan(other: Money): boolean {
    return this._value < other._value;
  }

  equals(other: Money): boolean {
    return this._value === other._value;
  }
}
