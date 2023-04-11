export enum ROUTES {
    LOGIN = '/auth/login',
    SIGNUP = '/auth/signup',
    SETUP_MFA = '/auth/setup-mfa',
    MFA_VERIFICATION = '/auth/mfa-verification',
    FORGOT_PASSWORD = '/auth/forgot-password',
    CREATE_PASSWORD = '/auth/create-password',
    RESET_PASSWORD = '/auth/reset-password',
    PROFILE = '/profile',
}

export enum API_ROUTES {
    LOGIN = '/auth/login',
    SIGNUP = '/auth/signup',
    SETUP_MFA = '/auth/setup-mfa',
    MFA_VERIFICATION = '/auth/mfa-verification',
    FORGOT_PASSWORD = '/auth/forgot-password',
    CREATE_PASSWORD = '/auth/create-password',
    RESET_PASSWORD = '/auth/reset-password',
    USER = '/user',
    GENERATE_QRCODE = '/auth/generate-qrcode',
    ACTIVATE_MFA = '/auth/activate-mfa',
    MFA = '/auth/mfa',
}

export enum AuthenticateType {
    EMAIL = 'Email',
    APP = '2FA-App',
}
