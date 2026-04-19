import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidateUserUseCase } from '../../application/use-cases/validate-user.use-case';
import { LoginDto } from '../../dto/login.dto';

export interface LoginResponse {
  access_token: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly validateUserUseCase: ValidateUserUseCase,
    private readonly jwtService: JwtService,
  ) {}

  async execute(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUserUseCase.execute(
      loginDto.email,
      loginDto.password,
    );
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
