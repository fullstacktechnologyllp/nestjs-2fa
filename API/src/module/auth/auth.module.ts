import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { Jwt2faStrategy } from './jwt-2fa/jwt-2fa.strategy';
import { config } from 'src/config/configuration';
import { MailService } from 'src/services/mail.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: config.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, Jwt2faStrategy, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
