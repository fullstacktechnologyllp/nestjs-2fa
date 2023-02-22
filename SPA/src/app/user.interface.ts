export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mfaEnable: boolean;
  mfaSecret: string;
  status: string;
  token: string;
}
