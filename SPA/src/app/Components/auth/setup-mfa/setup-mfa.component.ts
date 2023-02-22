import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "src/app/Services/api/api.service";
import { LoaderService } from "src/app/Services/loader/loader.service";
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
    private localStorageService: LocalstorageService,
    private loader: LoaderService
  ) {
    this.otpForm = this.formBuilder.group({
      otp: ["", [Validators.required]],
    });
  }

  async ngOnInit() {
    try {
      // this.loader.start();
      const qrCode = await this.apiService.generateQRCode();
      this.qrCodeLink = qrCode.qrCodeLink;
      console.log(qrCode);
      if (qrCode?.success) {
      }
      // this.loader.stop();
    } catch (error: any) {
      this.toast.error(error?.error?.message);
    }
  }

  async enableMFA() {
    if (this.otpForm.controls["otp"].value) {
      try {
        this.loader.start();
        const activateMFA = await this.apiService.activateMFA({
          otp: this.otpForm.controls["otp"].value,
        });
        this.loader.stop();
        if (activateMFA?.success) {
          // this.localStorageService.setItem("token", activateMFA.userData.token);
          this.toast.success(activateMFA?.message);
          this.router.navigate(["/profile"]);
        }
      } catch (error: any) {
        this.toast.error(error?.error?.message);
      }
    }
  }
}
