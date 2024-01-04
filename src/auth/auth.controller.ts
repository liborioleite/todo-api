import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDTO } from 'src/dtos/auth.login.dto';
import { Request, Response } from 'express';
import { CreateUserDTO } from 'src/dtos/create.user.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(
    @Body() data: AuthLoginDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.authService.login(data);

    if (!user) {
      return res.status(406).json({
        error: 'Erro ao realizar login',
        cause: 'E-mail e/ou senha inválidos',
      });
    }

    return res.status(200).json(user);
  }

  @Post('register')
  async register(
    @Body() data: CreateUserDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.authService.register(data);

    if (user) {
      return res
        .status(200)
        .json({ message: 'Usuário cadastrado com sucesso.' });
    }

    return res.status(406).json({
      error: 'Erro ao efetuar cadastro.',
      cause: 'Dados inválidos ou já cadastrados.',
    });
  }

  @Post('profile')
  async profile(@Body() data, @Res() res: Response) {
    try {
      const token = await this.authService.checkToken(data.token);

      if (!token) {
        return res.status(401).json({ error: 'Não autorizado.' });
      }

      return res.status(200).json(token);
    } catch (err) {
      console.log(err);
      return null
    }
  }
}
