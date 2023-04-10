import { Injectable } from '@nestjs/common';
import { OtpRepository } from './otp.repository';

@Injectable()
export class OtpService {
    constructor(private otpRepository: OtpRepository) {}

    createOTP(userId: number) {
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

        return this.otpRepository.addOtp(otpPayload);
    }
}
