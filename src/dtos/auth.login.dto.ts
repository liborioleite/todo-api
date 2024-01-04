import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class AuthLoginDTO {
  @IsEmail({}, { message: 'O campo e-mail deve ser preenchido.' })
  email: string;

  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 0,
      minNumbers: 0,
      minSymbols: 0,
      minUppercase: 0,
    },
    { message: 'O campo senha deve ser preenchido.' },
  )
  @IsString()
  password: string;
}
