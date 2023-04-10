import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '../user/user.model';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authServices: AuthService) {}

    @Post('/signup')
    async signUp(@Res() response, @Body() signUpPayload: User) {
        try {
            return response.send(await this.authServices.signUp(signUpPayload));
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: error?.message,
                success: false,
            });
        }
    }

    @Post('/login')
    async login(@Res() response, @Body() loginData: { email: string; password: string }) {
        try {
            return response.send(await this.authServices.login(loginData));
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: error?.message,
                success: false,
            });
        }
    }

    @Post('/forgot-password')
    async forgotPassword(@Res() response, @Body() body: User) {
        try {
            return response.send(await this.authServices.forgotPassword(body));
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: error?.message,
                success: false,
            });
        }
    }

    @Post('/create-password')
    async createPassword(@Res() response, @Body() body: { email: string; newPassword: string }) {
        try {
            return response.send(await this.authServices.createPassword(body));
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: error?.message,
                success: false,
            });
        }
    }

    @Post('/reset-password')
    @UseGuards(JwtAuthGuard)
    async resetPassword(@Res() response, @Req() request, @Body() body: { password: string; newPassword: string }) {
        try {
            return response.send(await this.authServices.resetPassword(request.user.id, body));
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: error?.message,
                success: false,
            });
        }
    }

    @Get('/generate-qrcode')
    @UseGuards(JwtAuthGuard)
    async register(@Res() response, @Req() request) {
        try {
            return response.send(await this.authServices.generateQrCodeDataURL(request.user));
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: error?.message,
                success: false,
            });
        }
    }

    @Post('/activate-mfa')
    @UseGuards(JwtAuthGuard)
    async turnOnTwoFactorAuthentication(@Res() response, @Req() request, @Body() body) {
        try {
            return response.send(await this.authServices.activateMFA(request.user, body));
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: error?.message,
                success: false,
            });
        }
    }

    @Post('/mfa')
    async authenticate(@Res() response, @Body() body) {
        try {
            return response.send(await this.authServices.authenticate(body));
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: error?.message,
                success: false,
            });
        }
    }
}
