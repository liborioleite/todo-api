import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from 'src/dtos/create.user.dto';
import { Request, Response } from 'express';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



  @Post('register')
  async register(
    @Body() data: CreateUserDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.userService.register(data);

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
}
