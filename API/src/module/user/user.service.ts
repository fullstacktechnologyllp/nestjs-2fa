import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { USER_NOT_FOUND, USER_UPDATED_SUCCESSFULLY } from 'src/constants/constant';
import { User } from './user.model';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private usersRepository: UserRepository, private mailService: MailerService) {}

    /**
     * to get all the User
     * @returns Users
     */
    async findAll(): Promise<User[]> {
        return this.usersRepository.findAll();
    }

    /**
     * to get user by ID
     * @returns User or message
     */
    async findUserByID(id: number) {
        const user: User = await this.usersRepository.findUserByID(id);
        if (user) {
            return user;
        }
        return {
            message: USER_NOT_FOUND,
            success: false,
        };
    }

    /**
     * to get user by Email
     * @returns User
     */
    async findUserByEmail(email: string): Promise<User> {
        return await this.usersRepository.findUserByEmail(email);
    }

    /**
     * for updating user details
     * @returns user
     */
    async updateUser(updatedUser: User | any, id: number) {
        const user = await this.findUserByID(id);
        if (user) {
            const isUpdate = this.usersRepository.updateUser(updatedUser, id);
            if (isUpdate) {
                return {
                    message: USER_UPDATED_SUCCESSFULLY,
                    success: true,
                };
            }
        }
        return {
            message: USER_NOT_FOUND,
            success: false,
        };
    }

    /**
     * for creating new user
     * @returns number of affected rows
     */
    async signUp(user: User | any): Promise<User> {
        return this.usersRepository.signUp(user);
    }

    /**
     * for Updating secret of any user
     * @returns number of affected rows
     */
    async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
        const updatedUser = { mfaSecret: secret };
        const isUpdated = this.updateUser(updatedUser, userId);
        return isUpdated;
    }

    /**
     * for enable 2FA for any user
     * @returns number of affected rows
     */
    async turnOnTwoFactorAuthentication(userId: number) {
        const updatedUser = { mfaEnable: true };
        const isUpdated = this.updateUser(updatedUser, userId);
        return isUpdated;
    }

    /**
     * Create and add otp in the OTP table
     * @param userId
     * @returns otp
     */
    async createOTP(email: string, userId: number) {
        // to generate unique otp
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Set expiration time to 5 minutes from now
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 5);

        const otpPayload = {
            userId,
            otp,
            expirationTime,
        };
        const addedOtp = await this.addOrUpdateOTP(otpPayload);
        await this.sendEmail(email, otp);
        return { otp, addedOtp };
    }

    /**
     * for add and update otp according userId
     * @param otpPayload
     * @returns user
     */
    async addOrUpdateOTP(otpPayload) {
        try {
            const existingUser = await this.checkUserExists(otpPayload?.userId);
            if (existingUser) {
                return await this.usersRepository.updateOtp(otpPayload);
            } else {
                return await this.usersRepository.addOtp(otpPayload);
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * for getting otp for user
     * @param userId
     * @returns user
     */
    async getOtp(userId: number) {
        return await this.usersRepository.getOtp(userId);
    }

    /**
     * For checking if user ID exists in the OTP table
     * @param userId
     * @returns boolean
     */
    async checkUserExists(userId: string) {
        const user = await this.usersRepository.findUserIDInOTP(userId);
        if (user) {
            return true;
        }
        return false;
    }

    /**
     * For sending otp on email for user verification
     * @param email
     * @param otp
     * @returns sendEmail
     */
    async sendEmail(email: string, otp: number) {
        const emailSend = await this.mailService.sendMail({
            to: email,
            from: {
                name: 'MFA Authenticator',
                address: 'nitin.fst.1015@gmail.com',
            },
            subject: 'MFA Authenticator - Forgot Password OTP',
            text: 'Welcome to the Nest Js App Email Demo',
            html: `<p>Forgot password was requested for your account and your OTP is ${otp}.</p>`,
        });
        return emailSend;
    }
}
