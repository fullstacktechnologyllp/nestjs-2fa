import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "src/app/Services/api/api.service";
import { ToastService } from "src/app/Services/toast/toast.service";

@Component({
  selector: "app-create-password",
  templateUrl: "./create-password.component.html",
  styleUrls: ["./create-password.component.scss"],
})
export class CreatePasswordComponent {
  createPasswordForm: FormGroup;
  currentEmail: string = history.state?.email;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toast: ToastService,
    private router: Router
  ) {
    this.createPasswordForm = this.formBuilder.group({
      newPassword: ["", [Validators.required]],
      confirmNewPassword: ["", [Validators.required]],
    });
  }

  async createNewPassword() {
    if (this.createPasswordForm.valid) {
      try {
        const payload = {
          email: this.currentEmail,
          newPassword: this.createPasswordForm.value.newPassword,
        };
        const createPassword = await this.apiService.createPassword(payload);
        if (createPassword.success) {
          setTimeout(() => {
            this.toast.success(createPassword.message);
          }, 500);
          setTimeout(() => {
            // this.toast.info("Please login with your new creadentials!!");
            this.router.navigate(["/auth/login"]);
          }, 2000);
        }
      } catch (error: any) {
        setTimeout(() => {
          this.toast.error(error?.error?.message);
        }, 1000);
      }
    }
  }
}
