import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private usersModel: typeof User,
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
