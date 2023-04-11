import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OTP } from './otp.model';
import { User } from './user.model';

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User)
        private usersModel: typeof User,
        @InjectModel(OTP)
        private otpModel: typeof OTP,
    ) {}

    /**
     * to get all the User
     * @returns Users
     */
    async findAll(): Promise<User[]> {
        return this.usersModel.findAll();
    }

    /**
     * to get user by ID
     * @returns User
     */
    async findUserByID(id: number): Promise<User> {
        return this.usersModel.findOne({
            where: {
                id,
            },
        });
    }

    /**
     * to get user by Email
     * @returns User
     */
    async findUserByEmail(email: string): Promise<User> {
        return this.usersModel.findOne({
            where: {
                email,
            },
        });
    }

    /**
     * for creating new user
     * @returns number of affected rows
     */
    async updateUser(updatedUser: User | any, id: number) {
        const result = await this.usersModel.update(updatedUser, {
            where: {
                id: id,
            },
            returning: true,
        });
        return result[0];
    }

    /**
     * for updating user details
     * @returns user
     */
    async signUp(user: User | any): Promise<User> {
        return this.usersModel.create(user);
    }

    /**
     * Add OTP into OTP table for user
     * @param otpPayload
     * @returns
     */
    async addOtp(otpPayload) {
        return this.otpModel.create(otpPayload);
    }

    /**
     * Update OTP for user
     * @param otpPayload
     * @returns
     */
    async updateOtp(otpPayload) {
        return this.otpModel.update({ otp: otpPayload?.otp, expirationTime: otpPayload?.expirationTime }, { where: { userId: otpPayload?.userId } });
    }

    /**
     * Find userId for exist in OTP table
     * @param userId
     * @returns
     */
    async findUserIDInOTP(userId) {
        return this.otpModel.findOne({
            where: {
                userId,
            },
        });
    }

    /**
     * Get OTP for User
     * @param userId
     * @returns
     */
    async getOtp(userId) {
        return await this.otpModel.findOne({
            where: {
                userId,
            },
        });
    }
}
