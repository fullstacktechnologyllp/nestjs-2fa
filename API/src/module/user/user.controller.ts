import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from './user.model';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) {}

    // @UseGuards(JwtAuthGuard)
    // @Get()
    // async getAllUsers(@Res() response) {
    //     const users = await this.usersServices.findAll();
    //     return response.status(HttpStatus.OK).json(users);
    // }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findUserById(@Req() request) {
        return await this.UserService.findUserByID(request.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    async updateUser(@Req() request, @Body() updateUser: User) {
        return await this.UserService.updateUser(updateUser, request.user.id);
    }
}
