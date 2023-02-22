import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "src/app/user.interface";
import { ToastService } from "../toast/toast.service";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  baseUrl = "http://localhost:3000";
  constructor(private http: HttpClient, private toast: ToastService) {}

  async signUp(userData: object) {
    try {
      const signUpResponse: any = await this.http
        .post(`${this.baseUrl}/auth/signup`, userData)
        .toPromise();
      return signUpResponse;
    } catch (error: any) {
      this.toast.error(error?.error?.message);
    }
  }

  async login(loginData: object) {
    try {
      const loginResponse: any = await this.http
        .post(`${this.baseUrl}/auth/login`, loginData)
        .toPromise();
      return loginResponse;
    } catch (error: any) {
      this.toast.error(error?.error?.message);
    }
  }

  async forgotPassword(data: object) {
    try {
      const forgotPaswordResponse: any = await this.http
        .post(`${this.baseUrl}/auth/forgot-password`, data)
        .toPromise();
      return forgotPaswordResponse;
    } catch (error: any) {
      this.toast.error(error?.error?.message);
    }
  }

  async createPassword(data: object) {
    try {
      const forgotPaswordResponse: any = await this.http
        .post(`${this.baseUrl}/auth/create-password`, data)
        .toPromise();
      return forgotPaswordResponse;
    } catch (error: any) {
      this.toast.error(error?.error?.message);
    }
  }

  async resetPassword(data: object) {
    try {
      const resetPasswordResponse: any = await this.http
        .post(`${this.baseUrl}/auth/reset-password`, data)
        .toPromise();
      return resetPasswordResponse;
    } catch (error: any) {
      this.toast.error(error?.error?.message);
    }
  }

  async getUserDetails() {
    try {
      const userDetails: any = await this.http
        .get(`${this.baseUrl}/user`)
        .toPromise();
      return userDetails;
    } catch (error: any) {
      this.toast.error(error?.error?.message);
    }
  }

  async updateProfile(payload: object) {
    try {
      const updateUser: any = await this.http
        .patch(`${this.baseUrl}/user`, payload)
        .toPromise();
      return updateUser;
    } catch (error: any) {
      this.toast.error(error?.error?.message);
    }
  }

  async generateQRCode() {
    try {
      const qrCode: any = await this.http
        .get(`${this.baseUrl}/auth/generate-qrcode`)
        .toPromise();
      return qrCode;
    } catch (error: any) {
      this.toast.error(error?.error?.message);
    }
  }

  async activateMFA(otp: object) {
    try {
      const mfaResponse: any = await this.http
        .post(`${this.baseUrl}/auth/activate-mfa`, otp)
        .toPromise();
      return mfaResponse;
    } catch (error: any) {
      this.toast.error(error?.error?.message);
    }
  }

  async otpVerification(otp: object) {
    try {
      const verificationResponse: any = await this.http
        .post(`${this.baseUrl}/auth/mfa`, otp)
        .toPromise();
      return verificationResponse;
    } catch (error: any) {
      this.toast.error(error?.error?.message);
    }
  }
}
