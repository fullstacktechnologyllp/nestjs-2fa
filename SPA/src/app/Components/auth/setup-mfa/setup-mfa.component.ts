import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "src/app/Services/api/api.service";
import { LocalstorageService } from "src/app/Services/localstorage/localstorage.service";
import { ToastService } from "src/app/Services/toast/toast.service";

@Component({
  selector: "app-setup-mfa",
  templateUrl: "./setup-mfa.component.html",
  styleUrls: ["./setup-mfa.component.scss"],
})
export class SetupMfaComponent implements OnInit {
  qrCodeLink = "";
  otpForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private toast: ToastService,
    private localStorageService: LocalstorageService
  ) {
    this.otpForm = this.formBuilder.group({
      otp: ["", [Validators.required]],
    });
  }

  async ngOnInit() {
    try {
      const qrCode = await this.apiService.generateQRCode();
      if (qrCode.success) {
        this.qrCodeLink = qrCode.qrCodeLink;
      }
    } catch (e: any) {
      setTimeout(() => {
        this.toast.error(e.error.message);
      }, 1000);
    }
  }

  async enableMFA() {
    if (this.otpForm.controls["otp"].value) {
      try {
        const activateMFA: any = await this.apiService.activateMFA({
          otp: this.otpForm.controls["otp"].value,
        });
        if (activateMFA?.success) {
          // this.localStorageService.setItem("token", activateMFA.userData.token);
          setTimeout(() => {
            this.toast.success(activateMFA.message);
          }, 500);
          setTimeout(() => {
            this.router.navigate(["/profile"]);
          }, 2000);
        }
      } catch (e: any) {
        setTimeout(() => {
          this.toast.error(e.error.message);
        }, 1000);
      }
    }
  }
}
