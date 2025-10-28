import { Controller, Post, Body } from '@nestjs/common';
import { LoginUseCase } from './use-cases/login.use-case';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @ApiOperation({ summary: 'Realiza a autenticação de um usuário' })
  @ApiResponse({
    status: 201,
    description: 'Login bem-sucedido, retornando o token de acesso.',
    schema: {
      example: { access_token: 'seu.jwt.token.aqui' },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() loginDto: LoginDto) {
    return this.loginUseCase.execute(loginDto);
  }
}
