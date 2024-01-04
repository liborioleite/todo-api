import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compareSync, hashSync } from 'bcrypt';
import { AuthLoginDTO } from 'src/dtos/auth.login.dto';
import { CreateUserDTO } from 'src/dtos/create.user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

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

      return user;
      // return await this.createToken(user);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async login(data: AuthLoginDTO) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: data.email,
        password: data.password,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos.');
    }

    return await this.createToken(user);
  }

  async createToken(data: User) {
    return {
      acess_token: this.jwtService.sign(
        {
          // De quem pertence o token
          id: data.id,
          name: data.name,
          email: data.email,
        },
        {
          expiresIn: '7 days',
          // Quem tem acesso ao token
          subject: String(data.id),
          issuer: 'login',
          // Quem está emitindo este token
          audience: 'users',
        },
      ),
    };
  }

  async checkToken(token: string) {
    try {

      const data = this.jwtService.verify(token, {
        issuer: 'login',
        audience: 'users',
      });

      return data;
    } catch (err) {
      console.log(err);
      throw new BadGatewayException(err);
    }
  }
}
