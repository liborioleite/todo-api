import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { CreateTaskDTO } from 'src/dtos/create.task.dto';
import { CreateUserDTO } from 'src/dtos/create.user.dto';
import { UpdateTaskDTO } from 'src/dtos/update.task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async register(data: CreateUserDTO) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });

      if (user) {
        return null;
      }

      return await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashSync(data.password, 12),
          // password: data.password,
        },
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async show(id: number) {
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: {
          id: id
        }
      })

      if (!user) {
        return null
      }

      return user
    } catch (err) {
      console.log(err);
      return null
    }
  }

  async createTask(data: CreateTaskDTO, user: User) {

    try {

      console.log(user);

      const task = await this.prisma.task.findFirst({
        where: {
          task_name: data.task_name,
          user_id: user.id
        }
      })

      if (task) {
        return null
      }

      return await this.prisma.task.create({
        data: {
          task_name: data.task_name,
          description: data.description,
          priority: data.priority,
          started_in: new Date(),
          status: data.status,
          user_id: user.id
        }
      })

    } catch (err) {
      console.log(err)
      return null
    }
  }

  async indexTask(user: User) {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          user_id: user.id,
        }
      })

      if (!tasks) {
        return null
      }

      return tasks
    } catch (err) {
      console.log(err);
      return null
    }
  }

  async showTask(id: number, user: User) {
    try {
      const task = await this.prisma.task.findFirst({
        where: {
          id: id,
          user_id: user.id,
        },
        include: {
          User: true
        }
      })

      if (!task) {
        console.log("Não há task cadastrada para esse usuário");
        return null
      }

      return task;
    } catch (err) {
      console.log(err);
      return null
    }
  }

  async patchTask(id: number, user: User, data: UpdateTaskDTO) {
    try {
      const task = await this.prisma.task.findFirst({
        where: {
          id: id,
          user_id: user.id
        }
      })

      if (!task) {
        return null
      }

      return await this.prisma.task.update({
        where: {
          id: id,
          user_id: user.id
        },
        data: {
          task_name: data.task_name,
          description: data.description,
          priority: data.priority,
          status: data.status,
        }
      })
    } catch (err) {
      console.log(err);
      return null
    }
  }

  async deleteTask(id: number, user: User) {
    try {
      const task = await this.prisma.task.findFirst({
        where: {
          id: id,
          user_id: user.id
        }
      })

      if (!task) {
        return null
      }

      return await this.prisma.task.delete({
        where: {
          id: id,
          user_id: user.id
        }
      })
    } catch (err) {
      console.log(err);
      return null
    }
  }
}
