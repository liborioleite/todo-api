import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { AuthLoginDTO } from 'src/dtos/auth.login.dto';
import { CreateUserDTO } from 'src/dtos/create.user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
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
          password: hashSync(data.password, 12),
        },
      });

      return user;
      // return await this.createToken(user);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async login(data:AuthLoginDTO): Promise<User | null> {
    try {
      return await this.prisma.user.findFirstOrThrow({
        where: {
          email: data.email,
        },
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // async login(data: AuthLoginDTO) {
  //   return await this.prisma.user.findFirstOrThrow({
  //     where: {
  //       email: data.email,
  //       password: data.password,
  //     },
  //   });
  // }

  // async createToken(data: User) {
  //   return {
  //     acess_token: this.jwtService.sign(
  //       {
  //         // De quem pertence o token
  //         id: data.id,
  //         name: data.name,
  //         email: data.email,
  //       },
  //       {
  //         expiresIn: '7 days',
  //         // Quem tem acesso ao token
  //         subject: String(data.id),
  //         issuer: 'login',
  //         // Quem está emitindo este token
  //         audience: 'users',
  //       },
  //     ),
  //   };
  // }

  // checkToken(token: string) {
  //   try {
  //     const data = this.jwtService.verify(token, {
  //       issuer: 'login',
  //       audience: 'users',
  //     });

  //     return data;
  //   } catch (err) {
  //     console.log(err);
  //     throw new BadGatewayException(err);
  //   }
  // }
}
