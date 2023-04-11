export const ORIGINS = ['http://localhost:4200'];

export const USER_NOT_FOUND = 'User not found!!';
export const USER_FOUND_FOR_EMAIL = 'User has found with this email';
export const USER_NOT_FOUND_FOR_EMAIL = 'User not found with this email';
export const INVALID_CREDENTIALS = 'Invalid Credentials!!';
export const USER_CREATED_SUCCESSFULLY = 'User has been created successfully!!';
export const USER_UPDATED_SUCCESSFULLY = 'User has been updated successfully!!';
export const EMAIL_ALREADY_EXISTS = 'Email is already exists.';
export const LOGIN_SUCCESSFULLY = 'Login Successfully!!';
export const ENABLE_MFA_FOR_PASSWORD = 'Please Enable MFA for create new password!!';
export const PASSWORD_UPDATED_SUCCESSFULLY = 'Password has been updated successfully!!';
export const WRONG_OLD_PASSWORD = 'Old Password is Wrong!!';
export const QR_CODE_GENERATED_SUCCESSFULLY = 'QR code has been generated successfully!!';
export const WRONG_OR_EXPIRED_OTP = 'Wrong or Expired OTP, Please try again.';
export const OTP_VERIFY_SUCCESSFULLY = 'OTP has been verify successfully!!';
export const OTP_SENT_TO_EMAIL = 'OTP has been sent to your Email!!';

export enum AuthenticateType {
    EMAIL = 'Email',
    APP = '2FA-App',
}
