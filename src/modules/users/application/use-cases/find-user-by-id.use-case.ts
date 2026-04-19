import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/data/repositories/user.repository';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class FindUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<UserEntity | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }
}
