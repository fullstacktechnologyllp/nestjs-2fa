import { Body, Controller, Get, HttpStatus, Patch, Req, Res, UseGuards } from '@nestjs/common';
import { User } from './users.model';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('user')
export class UsersController {
    constructor(private readonly usersServices: UsersService) {}

    // @UseGuards(JwtAuthGuard)
    // @Get()
    // async getAllUsers(@Res() response) {
    //     const users = await this.usersServices.findAll();
    //     return response.status(HttpStatus.OK).json(users);
    // }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findUserById(@Req() request, @Res() response) {
        const user = await this.usersServices.findUserByID(request.user.id);
        if (user) {
            return response.status(HttpStatus.OK).json({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                status: user.status,
                mfaEnable: user.mfaEnable,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        }
        return response.status(HttpStatus.BAD_REQUEST).json({
            message: 'User not found!!',
            success: false,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    async updateUser(@Req() request, @Res() response, @Body() updateUser: User) {
        const user = await this.usersServices.findUserByID(request.user.id);
        if (user) {
            const isUpdate = this.usersServices.updateUser(updateUser, request.user.id);
            if (isUpdate) {
                return response.status(HttpStatus.OK).json({
                    message: 'User has been updated successfully!!',
                    success: true,
                });
            }
        }
        return response.status(HttpStatus.BAD_REQUEST).json({
            message: 'User not found!!',
            success: false,
        });
    }
}
