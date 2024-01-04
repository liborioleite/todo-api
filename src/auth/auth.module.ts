import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      secret: `HXNY=Kj?Zda(5rWU44+(o0QzV88ozd"?`,
    }),
    UserModule,
    PrismaModule,
  ],
})
export class AuthModule {}
