import { Injectable } from '@nestjs/common';
import { USER_NOT_FOUND, USER_UPDATED_SUCCESSFULLY } from 'src/constants/constant';
import { User } from './user.model';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private usersRepository: UserRepository) {}

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
}
