import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NbAuthComponent } from "@nebular/auth";
import { CreatePasswordComponent } from "./create-password/create-password.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LoginComponent } from "./login/login.component";
import { MfaVerificationComponent } from "./mfa-verification/mfa-verification.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { SetupMfaComponent } from "./setup-mfa/setup-mfa.component";
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [
  {
    path: "",
    component: NbAuthComponent,
    children: [
      {
        path: "login",
        component: LoginComponent,
      },
      {
        path: "signup",
        component: SignupComponent,
      },
      {
        path: "setup-mfa",
        component: SetupMfaComponent,
      },
      {
        path: "mfa-verification",
        component: MfaVerificationComponent,
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
      },
      {
        path: "create-password",
        component: CreatePasswordComponent,
      },
      {
        path: "reset-password",
        component: ResetPasswordComponent,
      },
      {
        path: "**",
        redirectTo: "login",
        pathMatch: "full",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {}
