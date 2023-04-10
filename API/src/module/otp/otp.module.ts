import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OtpController } from './otp.controller';
import { OTP } from './otp.model';
import { OtpRepository } from './otp.repository';
import { OtpService } from './otp.service';

@Module({
    imports: [SequelizeModule.forFeature([OTP])],
    controllers: [OtpController],
    providers: [OtpRepository, OtpService],
})
export class OtpModule {}
