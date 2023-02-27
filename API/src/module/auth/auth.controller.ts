import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private usersServices: UsersService, private authServices: AuthService) {}

    @Post('/signup')
    async signUp(@Res() response, @Body() signUpPayload: User) {
        const { isValidate, message } = this.authServices.signUpValidation(signUpPayload);
        if (isValidate) {
            const user: User = await this.usersServices.findUserByEmail(signUpPayload.email);
            if (user) {
                return response.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Email is already exists.',
                    success: false,
                });
            }
            const hashedPassword = await bcrypt.hash(signUpPayload.password, 10);
            const userDetails = {
                firstName: signUpPayload.firstName,
                lastName: signUpPayload.lastName,
                email: signUpPayload.email,
                password: hashedPassword,
                mfaSecret: '',
                mfaEnable: false,
                status: signUpPayload.status,
            };
            const newUser = await this.usersServices.signUp(userDetails);
            return response.status(HttpStatus.OK).json({
                message: 'User has been created successfully!!',
                success: true,
                data: {
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    status: newUser.status,
                },
            });
        }
        return response.status(HttpStatus.BAD_REQUEST).json({
            message: message,
            success: false,
        });
    }

    @Post('/login')
    async login(@Res() response, @Body() loginData: { email: string; password: string }) {
        const user: User = await this.usersServices.findUserByEmail(loginData.email);
        if (user) {
            const isPasswordMatch = await bcrypt.compare(loginData.password, user.password);
            const token = this.authServices.generateToken(user);
            if (isPasswordMatch) {
                return response.status(HttpStatus.OK).json({
                    message: 'Login Successfully!!',
                    success: true,
                    userData: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: token.access_token,
                        status: user.status,
                        mfaEnable: user.mfaEnable,
                    },
                });
            }
            throw new BadRequestException('Invalid Credentials!!');
        }
        throw new BadRequestException('Invalid Credentials!!');
    }

    @Post('/forgot-password')
    async forgotPassword(@Res() response, @Body() body: User) {
        const user: User = await this.usersServices.findUserByEmail(body.email);
        if (user) {
            if (user?.mfaEnable) {
                return response.status(HttpStatus.OK).json({
                    message: 'User has found with this email',
                    success: true,
                    userData: {
                        mfaEnable: user.mfaEnable,
                    },
                });
            }
            throw new BadRequestException('Please Enable MFA for create new password!!');
        }
        throw new BadRequestException('User not found with this email');
    }

    @Post('/create-password')
    async createPassword(@Res() response, @Body() body: { email: string; newPassword: string }) {
        const user: User = await this.usersServices.findUserByEmail(body.email);
        if (user) {
            const hashedPassword = await bcrypt.hash(body.newPassword, 10);
            const updateUser = {
                password: hashedPassword,
            };
            const isUpdate = this.usersServices.updateUser(updateUser, user.id);
            if (isUpdate) {
                return response.status(HttpStatus.OK).json({
                    message: 'Password has been updated successfully!!',
                    success: true,
                });
            }
        }
        throw new BadRequestException('User not found with this email');
    }

    @Post('/reset-password')
    @UseGuards(JwtAuthGuard)
    async resetPassword(@Req() request, @Res() response, @Body() body: { password: string; newPassword: string }) {
        const user: User = await this.usersServices.findUserByID(request.user.id);
        if (user) {
            const isPasswordMatch = await bcrypt.compare(body.password, user.password);
            if (isPasswordMatch) {
                const newHashedPassword = await bcrypt.hash(body.newPassword, 10);
                const updateUser = {
                    password: newHashedPassword,
                };
                const isUpdate = this.usersServices.updateUser(updateUser, request.user.id);
                if (isUpdate) {
                    return response.status(HttpStatus.OK).json({
                        message: 'Password has been updated successfully!!',
                        success: true,
                    });
                }
            }
            throw new BadRequestException('Old Password is Wrong!!');
        }
        throw new BadRequestException('User not found with this email');
    }

    @Get('/generate-qrcode')
    @UseGuards(JwtAuthGuard)
    async register(@Res() response, @Req() request) {
        const { otpAuthUrl } = await this.authServices.generateMFASecret(request.user);
        const qrCodeLink = await this.authServices.generateQrCodeDataURL(otpAuthUrl);
        return response.json({
            message: 'QR code has been generated successfully!!',
            success: true,
            qrCodeLink: qrCodeLink,
        });
    }

    @Post('/activate-mfa')
    @UseGuards(JwtAuthGuard)
    async turnOnTwoFactorAuthentication(@Req() request, @Res() response, @Body() body) {
        const user = await this.usersServices.findUserByID(request.user.id);
        if (user) {
            const isCodeValid = this.authServices.isMFACodeValid(body.otp, user);
            if (isCodeValid) {
                const isTurnOn = await this.usersServices.turnOnTwoFactorAuthentication(request.user.id);
                if (isTurnOn) {
                    const token = this.authServices.generateToken(user);
                    return response.status(HttpStatus.OK).json({
                        message: 'Multi Factor Authentication has been enabled!!',
                        success: true,
                        userData: {
                            email: user.email,
                            token: token.access_token,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            status: user.status,
                        },
                    });
                }
            }
            throw new BadRequestException('Wrong or Expired OTP, Please try again.');
        }
    }

    @Post('/mfa')
    async authenticate(@Res() response, @Body() body) {
        try {
            const user = await this.usersServices.findUserByEmail(body?.email);
            if (user) {
                const isCodeValid = this.authServices.isMFACodeValid(body?.otp, user);
                if (isCodeValid) {
                    return response.status(HttpStatus.OK).json({
                        message: 'OTP has been verify successfully!!',
                        success: true,
                    });
                }
                throw new BadRequestException('Wrong or Expired OTP, Please try again.');
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
