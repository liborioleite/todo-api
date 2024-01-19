import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from 'src/dtos/create.user.dto';
import { Request, Response } from 'express';
import { CreateTaskDTO } from 'src/dtos/create.task.dto';
import { UpdateTaskDTO } from 'src/dtos/update.task.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
  ) { }

  @Post('register')
  async register(
    @Body() data: CreateUserDTO,
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

  @Post('create-task')
  async createTask(@Body() data: CreateTaskDTO,
    @Req() req: Request,
    @Res() res: Response,) {

    const task = await this.userService.createTask(data, req.user)

    if (!task) {
      return res.status(403).json({ error: 'Erro ao criar tarefa.' })
    }

    return res.status(200).json({ message: 'Tarefa criada com sucesso.' })
  }

  @Get('all-tasks')
  async listTasks(@Req() req: Request,
    @Res() res: Response) {

    const tasks = await this.userService.indexTask(req.user)

    if (!tasks) {
      return res.status(403).json({ error: 'Erro ao listar tarefas.' })
    }

    return res.status(200).json(tasks)

  }

  @Get('show-task/:id')
  async showTask(@Param('id', ParseIntPipe) id: number, @Req() req: Request,
    @Res() res: Response) {

    const task = await this.userService.showTask(id, req.user)

    if (!task) {
      return res.status(403).json({ error: 'Erro ao visualizar tarefa.', cause: `Tarefa não existente.` })
    }
    return res.status(200).json(task)
  }

  @Patch('update-task/:id')
  async updateTask(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Body() data: UpdateTaskDTO,
    @Res() res: Response) {
    const task = await this.userService.patchTask(id, req.user, data)

    if (!task) {
      return res.status(403).json({ error: 'Erro ao atualizar tarefa.', cause: `Tarefa não existente.` })

    }
    return res.status(200).json({ message: 'Tarefa atualizada com sucesso.' })

  }

  @Delete('delete-task/:id')
  async deleteTask(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
    const task = await this.userService.deleteTask(id, req.user)

    if (!task) {
      return res.status(403).json({ error: 'Erro ao deletar tarefa.', cause: `Tarefa não existente.` })

    }
    return res.status(200).json({ message: 'Tarefa deletada com sucesso.' })

  }
}
