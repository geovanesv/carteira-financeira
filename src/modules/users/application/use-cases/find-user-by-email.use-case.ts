import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/data/repositories/user.repository';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }
}
