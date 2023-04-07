import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailService: MailerService) {}

    async sendEmail() {
        const emailSend = await this.mailService.sendMail({
            to: 'shyam.fst.1063@gmail.com',
            from: {
                name: 'MFA Authenticator',
                address: 'nitin.fst.1015@gmail.com',
            },
            subject: 'Email Demo from SendGrid',
            text: 'Welcome to the Nest Js App Email Demo',
            html: '<h1>Welcome to the Nest Js App Email Demo</h1>',
        });
        return emailSend;
    }
}
