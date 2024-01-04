import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { CreateUserDTO } from 'src/dtos/create.user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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
          // password: hashSync(data.password, 12),
          password: data.password,
        },
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
