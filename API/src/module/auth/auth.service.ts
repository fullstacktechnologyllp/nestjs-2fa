import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { User } from '../user/user.model';
import { toDataURL } from 'qrcode';
import { UserService } from '../user/user.service';
import {
    AuthenticateType,
    EMAIL_ALREADY_EXISTS,
    INVALID_CREDENTIALS,
    LOGIN_SUCCESSFULLY,
    OTP_SENT_TO_EMAIL,
    OTP_VERIFY_SUCCESSFULLY,
    PASSWORD_UPDATED_SUCCESSFULLY,
    QR_CODE_GENERATED_SUCCESSFULLY,
    USER_CREATED_SUCCESSFULLY,
    USER_FOUND_FOR_EMAIL,
    USER_NOT_FOUND_FOR_EMAIL,
    WRONG_OLD_PASSWORD,
    WRONG_OR_EXPIRED_OTP,
} from 'src/constants/constant';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private userService: UserService) {}

    /**
     * for creating new token from user details
     * @returns token
     */
    generateToken(user: User) {
        return {
            access_token: this.jwtService.sign({
                id: user.id,
                email: user.email,
            }),
        };
    }

    /**
     * For Sign up in the App
     * @param signUpPayload
     * @returns created user details
     */
    async signUp(signUpPayload: User) {
        const { isValidate, message } = this.signUpValidation(signUpPayload);
        if (isValidate) {
            const user: User = await this.userService.findUserByEmail(signUpPayload.email);
            if (user) {
                return {
                    message: EMAIL_ALREADY_EXISTS,
                    success: false,
                };
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
            const newUser = await this.userService.signUp(userDetails);
            return {
                message: USER_CREATED_SUCCESSFULLY,
                success: true,
                data: {
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    status: newUser.status,
                },
            };
        }
        return {
            message: message,
            success: false,
        };
    }

    /**
     * For login into the App using emaila and password
     * @param loginPayload
     * @returns success or error message
     */
    async login(loginPayload) {
        const user: User = await this.userService.findUserByEmail(loginPayload.email);
        if (user) {
            const isPasswordMatch = await bcrypt.compare(loginPayload.password, user.password);
            const token = this.generateToken(user);
            if (isPasswordMatch) {
                // const emailSend = await this.mailService.sendEmail();
                // console.log('emailSend => ', emailSend);
                return {
                    message: LOGIN_SUCCESSFULLY,
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
                };
            }
            return {
                message: INVALID_CREDENTIALS,
                success: false,
            };
        }
        return {
            message: INVALID_CREDENTIALS,
            success: false,
        };
    }

    /**
     * For forgot password recovery from email
     * @param payload
     * @returns
     */
    async forgotPassword(payload) {
        const user: User = await this.userService.findUserByEmail(payload.email);
        if (user) {
            if (user?.mfaEnable) {
                return {
                    message: USER_FOUND_FOR_EMAIL,
                    success: true,
                    userData: {
                        mfaEnable: user.mfaEnable,
                    },
                };
            }
            const { otp } = await this.userService.createOTP(user?.email, user?.id);
            if (otp) {
                return {
                    message: OTP_SENT_TO_EMAIL,
                    success: true,
                    userData: {
                        mfaEnable: user.mfaEnable,
                    },
                };
            }
        }
        return {
            message: USER_NOT_FOUND_FOR_EMAIL,
            success: false,
        };
    }

    /**
     * for Generating new password after authentication for forgot password user
     * @param payload
     * @returns
     */
    async createPassword(payload) {
        const user: User = await this.userService.findUserByEmail(payload.email);
        if (user) {
            const hashedPassword = await bcrypt.hash(payload.newPassword, 10);
            const updateUser = {
                password: hashedPassword,
            };
            const isUpdate = this.userService.updateUser(updateUser, user.id);
            if (isUpdate) {
                return {
                    message: PASSWORD_UPDATED_SUCCESSFULLY,
                    success: true,
                };
            }
        }
        return {
            message: USER_NOT_FOUND_FOR_EMAIL,
            success: false,
        };
    }

    /**
     * For Reset password of User using old password
     * @param userId
     * @param payload
     * @returns
     */
    async resetPassword(userId, payload) {
        const user: any = await this.userService.findUserByID(userId);
        if (user) {
            const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
            if (isPasswordMatch) {
                const newHashedPassword = await bcrypt.hash(payload.newPassword, 10);
                const updateUser = {
                    password: newHashedPassword,
                };
                const isUpdate = this.userService.updateUser(updateUser, userId);
                if (isUpdate) {
                    return {
                        message: PASSWORD_UPDATED_SUCCESSFULLY,
                        success: true,
                    };
                }
            }
            return {
                message: WRONG_OLD_PASSWORD,
                success: false,
            };
        }
        return {
            message: USER_NOT_FOUND_FOR_EMAIL,
            success: false,
        };
    }

    /**
     * for validating the sign up form data
     * @returns
     */
    signUpValidation(signUpPayload: User) {
        for (const key in signUpPayload) {
            if (signUpPayload[key] === '') {
                const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
                return { isValidate: false, message: `${fieldName} is required!` };
            }
        }
        return { isValidate: true };
    }

    /**
     * for generating 2fa secret for user
     * @returns secret with authUrl
     */
    async generateMFASecret(user: User) {
        const secret = authenticator.generateSecret();

        const otpAuthUrl = authenticator.keyuri(user.email, 'MFA-Authenticator', secret);

        const isEnable = await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);
        if (isEnable) {
            return { secret, otpAuthUrl };
        }
    }

    /**
     * for generating QR Code Url for the OTP
     * @returns authUrl for OTP
     */
    async generateQrCodeDataURL(user) {
        const { otpAuthUrl } = await this.generateMFASecret(user);
        const qrCodeLink = await toDataURL(otpAuthUrl);
        return {
            message: QR_CODE_GENERATED_SUCCESSFULLY,
            success: true,
            qrCodeLink: qrCodeLink,
        };
    }

    /**
     * For Activate 2FA of User by adding Secret value into user DB
     * @param requestUser
     * @param payload
     * @returns
     */
    async activateMFA(requestUser, payload) {
        const user: any = await this.userService.findUserByID(requestUser.id);
        if (user) {
            const isCodeValid = this.isMFACodeValid(payload.otp, user);
            if (isCodeValid) {
                const isTurnOn = await this.userService.turnOnTwoFactorAuthentication(user.id);
                if (isTurnOn) {
                    const token = this.generateToken(user);
                    return {
                        message: 'Multi Factor Authentication has been enabled!!',
                        success: true,
                        userData: {
                            email: user.email,
                            token: token.access_token,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            status: user.status,
                        },
                    };
                }
            }
            return {
                message: WRONG_OR_EXPIRED_OTP,
                success: false,
            };
        }
    }

    /**
     * For Authenticate 2FA code from App which user submit for authenticate
     * @param payload
     * @returns
     */
    async authenticate(payload) {
        try {
            const user = await this.userService.findUserByEmail(payload?.email);
            if (user) {
                if (payload?.type === AuthenticateType.APP) {
                    const isCodeValid = this.isMFACodeValid(payload?.otp, user);
                    if (isCodeValid) {
                        return {
                            message: OTP_VERIFY_SUCCESSFULLY,
                            success: true,
                        };
                    }
                    return {
                        message: WRONG_OR_EXPIRED_OTP,
                        success: false,
                    };
                } else {
                    const isCodeValid = await this.isEmailCodeValied(payload?.otp, user);
                    if (isCodeValid) {
                        return {
                            message: OTP_VERIFY_SUCCESSFULLY,
                            success: true,
                        };
                    }
                    return {
                        message: WRONG_OR_EXPIRED_OTP,
                        success: false,
                    };
                }
            }
        } catch (error) {
            throw error.message;
        }
    }

    /**
     * for validating user secret code
     * @returns token with secret
     */
    isMFACodeValid(mfaOTP: string, user: User) {
        return authenticator.verify({ token: mfaOTP, secret: user.mfaSecret });
    }

    /**
     * For validation user otp from email
     * @param emailOTP
     * @param user
     * @returns boolian
     */
    async isEmailCodeValied(emailOTP: number, user: User) {
        const userOtp: any = await this.userService.getOtp(user?.id);
        const currentTime = new Date().getTime();

        // Compare the current time with the expiration time
        if (emailOTP == userOtp?.otp && currentTime < userOtp?.expirationTime) {
            return true;
        }
        // OTP is expired
        return false;
    }
}
