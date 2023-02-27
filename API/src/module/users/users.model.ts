import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
    @Column
    firstName: string;

    @Column
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column
    password: string;

    @Column
    mfaSecret: string;

    @Column
    mfaEnable: boolean;

    @Column
    status: string;

    @Column
    createdAt: Date;

    @Column
    updatedAt: Date;
}
