import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ROUTES } from 'src/app/Constants/constants';
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
        return this.http.post<SignUpResponseData>(`${this.baseUrl}${API_ROUTES.SIGNUP}`, payload);
    }

    login(payload: LoginFormData) {
        return this.http.post<LoginResponseData>(`${this.baseUrl}${API_ROUTES.LOGIN}`, payload);
    }

    forgotPassword(payload: { email: string }) {
        return this.http.post<ForgotPasswordResponse>(`${this.baseUrl}${API_ROUTES.FORGOT_PASSWORD}`, payload);
    }

    createPassword(payload: { email: string; newPassword: string }) {
        return this.http.post<Message>(`${this.baseUrl}${API_ROUTES.CREATE_PASSWORD}`, payload);
    }

    resetPassword(payload: { password: string; newPassword: string }) {
        return this.http.post<Message>(`${this.baseUrl}${API_ROUTES.RESET_PASSWORD}`, payload);
    }

    getUserDetails() {
        return this.http.get<User>(`${this.baseUrl}${API_ROUTES.USER}`);
    }

    updateProfile(payload: object) {
        return this.http.patch<Message>(`${this.baseUrl}${API_ROUTES.USER}`, payload);
    }

    generateQRCode() {
        return this.http.get<QRCodeResponse>(`${this.baseUrl}${API_ROUTES.GENERATE_QRCODE}`);
    }

    activateMFA(payload: { otp: string }) {
        return this.http.post<LoginResponseData>(`${this.baseUrl}${API_ROUTES.ACTIVATE_MFA}`, payload);
    }

    otpVerification(payload: { otp: string; email: string }) {
        return this.http.post<Message>(`${this.baseUrl}${API_ROUTES.MFA}`, payload);
    }
}
