import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "src/app/Services/api/api.service";
import { ToastService } from "src/app/Services/toast/toast.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  currentEmail: string = history.state?.email;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toast: ToastService,
    private router: Router
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      oldPassword: ["", [Validators.required]],
      newPassword: ["", [Validators.required]],
      confirmNewPassword: ["", [Validators.required]],
    });
  }

  async resetPassword() {
    try {
      const payload = {
        password: this.resetPasswordForm.value.oldPassword,
        newPassword: this.resetPasswordForm.value.newPassword,
      };
      const resetPassword = await this.apiService.resetPassword(payload);
      if (resetPassword?.success) {
        setTimeout(() => {
          this.toast.success(resetPassword?.message);
        }, 500);
        setTimeout(() => {
          this.router.navigate(["/profile"]);
        }, 2000);
      }
    } catch (error: any) {
      console.error(error?.error?.message);
    }
  }
}
