import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { OTP } from './otp.model';
@Module({
    imports: [SequelizeModule.forFeature([User, OTP])],
    providers: [UserRepository, UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UsersModule {}
