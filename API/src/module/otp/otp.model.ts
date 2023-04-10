import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class OTP extends Model {
    @Column
    userId: number;

    @Column
    otp: number;

    @Column
    expirationTime: Date;

    @Column
    createdAt: Date;

    @Column
    updatedAt: Date;
}
