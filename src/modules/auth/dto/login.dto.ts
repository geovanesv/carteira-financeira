import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'E-mail do usuário para autenticação.',
    example: 'joao.silva@example.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'O e-mail não pode ser vazio.' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo de 6 caracteres).',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
  password: string;
}
