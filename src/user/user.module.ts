import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [UserService,AuthService],
  exports: [UserService],
  imports:[PrismaModule,JwtModule.register({
    secret: `HXNY=Kj?Zda(5rWU44+(o0QzV88ozd"?`,
  })]
})
export class UserModule {}
