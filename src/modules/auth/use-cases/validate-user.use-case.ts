import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FindUserByEmailUseCase } from '../../users/use-cases/find-user-by-email.use-case';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
  ) {}

  async execute(
    email: string,
    pass: string,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.findUserByEmailUseCase.execute(email);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
