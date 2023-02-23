import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    ForgotPasswordResponse,
    LoginFormData,
    LoginResponseData,
    Message,
    QRCodeResponse,
    SignUpFormData,
    SignUpResponseData,
    User,
} from 'src/app/user.interface';
import { ToastService } from '../toast/toast.service';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    baseUrl = 'http://localhost:3000';
    constructor(private http: HttpClient, private toast: ToastService) {}

    signUp(payload: SignUpFormData) {
        return this.http.post<SignUpResponseData>(`${this.baseUrl}/auth/signup`, payload);
    }

    login(payload: LoginFormData) {
        return this.http.post<LoginResponseData>(`${this.baseUrl}/auth/login`, payload);
    }

    forgotPassword(payload: { email: string }) {
        return this.http.post<ForgotPasswordResponse>(`${this.baseUrl}/auth/forgot-password`, payload);
    }

    createPassword(payload: { email: string; newPassword: string }) {
        return this.http.post<Message>(`${this.baseUrl}/auth/create-password`, payload);
    }

    resetPassword(payload: { password: string; newPassword: string }) {
        return this.http.post<Message>(`${this.baseUrl}/auth/reset-password`, payload);
    }

    getUserDetails() {
        return this.http.get<User>(`${this.baseUrl}/user`);
    }

    updateProfile(payload: object) {
        return this.http.patch<Message>(`${this.baseUrl}/user`, payload);
    }

    generateQRCode() {
        return this.http.get<QRCodeResponse>(`${this.baseUrl}/auth/generate-qrcode`);
    }

    activateMFA(payload: { otp: string }) {
        return this.http.post<LoginResponseData>(`${this.baseUrl}/auth/activate-mfa`, payload);
    }

    otpVerification(payload: { otp: string; email: string }) {
        return this.http.post<Message>(`${this.baseUrl}/auth/mfa`, payload);
    }
}
