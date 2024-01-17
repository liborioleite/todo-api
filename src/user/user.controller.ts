import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from 'src/dtos/create.user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateTaskDTO } from 'src/dtos/create.task.dto';
import { Task, User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }



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

  @UseGuards(AuthGuard)
  @Post('create-task')
  async createTask(@Body() data: CreateTaskDTO,
    @Req() req: Request,
    @Res() res: Response,) {

    const task = await this.userService.createTask(data)

    if (!task) {
      return res.status(403).json({ error: 'Erro ao criar tarefa.' })
    }

    return res.status(200).json({ message: 'Tarefa criada com sucesso.' })
  }
}
