import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OTP } from './otp.model';

@Injectable()
export class OtpRepository {
    constructor(
        @InjectModel(OTP)
        private otpModel: typeof OTP,
    ) {}

    addOtp(otpPayload) {
        return this.otpModel.create(otpPayload);
    }
}
