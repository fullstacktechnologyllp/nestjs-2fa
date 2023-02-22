import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "src/app/Services/api/api.service";
import { LoaderService } from "src/app/Services/loader/loader.service";
import { ToastService } from "src/app/Services/toast/toast.service";

@Component({
  selector: "app-mfa-verification",
  templateUrl: "./mfa-verification.component.html",
  styleUrls: ["./mfa-verification.component.scss"],
})
export class MfaVerificationComponent {
  otpForm: FormGroup;
  currentEmail: string = history.state?.email;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService,
    private loader: LoaderService
  ) {
    this.otpForm = this.formBuilder.group({
      otp: ["", [Validators.required]],
    });
  }

  async mfaVerification() {
    if (this.otpForm.controls["otp"].value) {
      try {
        this.loader.start();
        const otpVerification = await this.apiService.otpVerification({
          otp: this.otpForm.controls["otp"].value,
          email: history?.state?.email,
        });
        this.loader.stop();
        if (otpVerification?.success) {
          this.toast.success(otpVerification?.message);
          this.router.navigate([history?.state?.redirection], {
            state: { email: history?.state?.email },
          });
        }
      } catch (error: any) {
        this.toast.error(error?.error?.message);
      }
    }
  }
}
