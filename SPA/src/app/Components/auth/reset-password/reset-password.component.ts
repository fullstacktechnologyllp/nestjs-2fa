import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "src/app/Services/api/api.service";
import { LoaderService } from "src/app/Services/loader/loader.service";
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
    private router: Router,
    private loader: LoaderService
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
      this.loader.start();
      const resetPassword = await this.apiService.resetPassword(payload);
      this.loader.stop();
      if (resetPassword?.success) {
        this.toast.success(resetPassword?.message);
        this.router.navigate(["/profile"]);
      }
    } catch (error: any) {
      console.error(error?.error?.message);
    }
  }
}
