import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { FindUserByEmailUseCase } from './use-cases/find-user-by-email.use-case';
import { FindUserByIdUseCase } from './use-cases/find-user-by-id.use-case';
import { WalletsModule } from '../wallets/wallets.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), WalletsModule],
  controllers: [UsersController],
  providers: [
    UserRepository,
    CreateUserUseCase,
    FindUserByEmailUseCase,
    FindUserByIdUseCase,
  ],
  exports: [FindUserByEmailUseCase, FindUserByIdUseCase],
})
export class UsersModule {}