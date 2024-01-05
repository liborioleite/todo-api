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
import { IsLongitude } from 'class-validator';
import { AuthGuard } from 'src/guards/auth.guard';

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

  @UseGuards(AuthGuard)
  @Post('profile')
  async profile(@Req() req) {


    return {profile:'ok',data:req.token_payload}


    // try {
    //   // return await this.authService.checkToken();
    //   const token = await this.authService.checkToken(
    //     (access_token ?? '').split(' ')[1],
    //   );

    //   console.log(access_token);

    //   console.log(token);

    //   if (!token) {
    //     return res.status(401).json({
    //       error: 'Erro ao realizar requisição.',
    //       cause: 'Não autorizado.',
    //     });
    //   }

    //   return res.status(200).json(token);
    // } catch (err) {
    //   console.log(err);
    //   return res.status(401).json({
    //     error: 'Erro ao realizar requisição.',
    //     cause: `${err}`,
    //   });
    // }
  }
}
