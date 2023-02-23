export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mfaEnable: boolean;
    status: string;
}

export interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    status: string;
}

export interface SignUpResponseData {
    success: boolean;
    message: string;
    userData: {
        email: string;
        firstName: string;
        lastName: string;
        status: string;
    };
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface LoginResponseData {
    success: boolean;
    message: string;
    userData: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        token: string;
        status: string;
        mfaEnable: boolean;
    };
}

export interface Message {
    message: string;
    success: boolean;
}

export interface ForgotPasswordResponse {
    success: boolean;
    message: string;
    userData: {
        mfaEnable: boolean;
    };
}

export interface QRCodeResponse {
    success: boolean;
    message: string;
    qrCodeLink: string;
}
