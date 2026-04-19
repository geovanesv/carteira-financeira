import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UserRepository } from '../../infrastructure/data/repositories/user.repository';
import { WalletRepository } from '../../../wallets/infrastructure/data/repositories/wallet.repository';
import * as bcrypt from 'bcrypt';

export interface CreateUserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    await this.walletRepository.create({
      userId: savedUser.id,
      balance: 0,
    });

    const { password: _password, ...result } = savedUser;
    return result;
  }
}
