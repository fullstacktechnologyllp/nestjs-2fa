import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxAuthRoutingModule } from "./auth-routing.module";
import { AuthComponent } from "./auth.component";
import { NbAuthModule } from "@nebular/auth";
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
  NbSpinnerModule,
} from "@nebular/theme";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { SetupMfaComponent } from "./setup-mfa/setup-mfa.component";
import { MfaVerificationComponent } from "./mfa-verification/mfa-verification.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { CreatePasswordComponent } from "./create-password/create-password.component";

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    SignupComponent,
    SetupMfaComponent,
    MfaVerificationComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    CreatePasswordComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,
    NbAuthModule,
    ReactiveFormsModule,
    NbSpinnerModule,
  ],
})
export class NgxAuthModule {}
