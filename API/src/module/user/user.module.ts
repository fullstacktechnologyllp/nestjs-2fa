import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
@Module({
    imports: [SequelizeModule.forFeature([User])],
    providers: [UserRepository, UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UsersModule {}
