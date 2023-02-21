import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "src/app/Services/api/api.service";
import { ToastService } from "src/app/Services/toast/toast.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent {
  emailForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toast: ToastService,
    private router: Router
  ) {
    this.emailForm = this.formBuilder.group({
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
    });
  }

  async forgotPassword() {
    const forgotPaswordResponse = await this.apiService.forgotPassword(
      this.emailForm.value
    );
    if (forgotPaswordResponse?.success) {
      setTimeout(() => {
        this.toast.success("Please authenticate for Reset Password");
        this.router.navigate(["/auth/mfa-verification"], {
          state: {
            email: this.emailForm.value.email,
            redirection: "/auth/create-password",
          },
        });
      }, 1000);
      return;
    }
    if (forgotPaswordResponse?.message && !forgotPaswordResponse?.success) {
      this.toast.error(forgotPaswordResponse.message);
    }
  }
}
