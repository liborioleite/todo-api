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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDTO } from 'src/dtos/auth.login.dto';
import { Request, Response } from 'express';
import { CreateUserDTO } from 'src/dtos/create.user.dto';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Public } from 'src/decorators/SetMetadata';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() data: AuthLoginDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    
    const user = await this.authService.login(data);
    console.log("DATA", data);

    console.log("USER AQUI", user);
    

    if (!user) {
      return res.status(406).json({
        error: 'Erro ao realizar login',
        cause: 'E-mail e/ou senha inválidos',
      });
    }

    const password = user.password;
    console.log('SENHA USUÁRIO: ', password);
    
    const sanitize_password = compareSync(data.password, `${password}`);

    if (sanitize_password) {
      try {
        const { password, ...payload } = user;
        const access_token = await this.jwtService.signAsync(payload);
        console.log('Payload:', payload);

        return res.status(200).json({ access_token });
      } catch (error) {
        return res.status(403).json({ error: 'Erro ao realizar login.' });
      }
    }

    return res.status(404).json({ error: 'Usuário ou senha incorretos.' });
  }

  @Public()
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

    return req.user;
  }
}
