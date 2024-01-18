import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Headers,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDTO } from 'src/dtos/auth.login.dto';
import { Request, Response } from 'express';
import { CreateUserDTO } from 'src/dtos/create.user.dto';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Public } from 'src/decorators/SetMetadata';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @Public()
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
  async profile(@Req() req: Request) {

    console.log(req.user);
    
    return req.user

  }
}
