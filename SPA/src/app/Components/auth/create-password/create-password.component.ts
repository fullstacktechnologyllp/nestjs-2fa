import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "src/app/Services/api/api.service";
import { LoaderService } from "src/app/Services/loader/loader.service";
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
    private router: Router,
    private loader: LoaderService
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
        this.loader.start();
        const createPassword = await this.apiService.createPassword(payload);
        this.loader.stop();
        if (createPassword.success) {
          this.toast.success(createPassword.message);
          this.router.navigate(["/auth/login"]);
        }
      } catch (error: any) {
        this.toast.error(error?.error?.message);
      }
    }
  }
}
