import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { User } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { toDataURL } from 'qrcode';
import { MailService } from 'src/services/mail.service';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private usersService: UsersService, private mailService: MailService) {}

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

        const isEnable = await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
        if (isEnable) {
            return { secret, otpAuthUrl };
        }
    }

    /**
     * for generating QR Code Url for the OTP
     * @returns authUrl for OTP
     */
    async generateQrCodeDataURL(otpAuthUrl: string) {
        return toDataURL(otpAuthUrl);
    }

    /**
     * for validating user secret code
     * @returns token with secret
     */
    isMFACodeValid(mfaOTP: string, user: User) {
        return authenticator.verify({ token: mfaOTP, secret: user.mfaSecret });
    }
}
