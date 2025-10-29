import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../entities/user.entity';
import { CreateWalletUseCase } from '../../wallets/use-cases/create-wallet.use-case';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly createWalletUseCase: CreateWalletUseCase,
  ) {}

  async execute(
    createUserDto: CreateUserDto,
  ): Promise<Omit<UserEntity, 'password'>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    await this.createWalletUseCase.execute(savedUser.id);

    const { password, ...result } = savedUser;
    return result;
  }
}
