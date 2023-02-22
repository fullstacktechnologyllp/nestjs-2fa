import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "src/app/Services/api/api.service";
import { LoaderService } from "src/app/Services/loader/loader.service";
import { LocalstorageService } from "src/app/Services/localstorage/localstorage.service";
import { ToastService } from "src/app/Services/toast/toast.service";
import { User } from "src/app/user.interface";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  MfaEnableBefore: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private localStorageService: LocalstorageService,
    private toast: ToastService,
    private router: Router,
    private loader: LoaderService
  ) {
    this.MfaEnableBefore = false;
    this.profileForm = this.formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: [{ value: "", disabled: true }, [Validators.required]],
      status: [{ value: "", disabled: true }],
      mfaEnable: [""],
    });
  }

  async ngOnInit() {
    await this.getUserProfile();
  }

  async getUserProfile() {
    try {
      this.loader.start();
      const user: User = await this.apiService.getUserDetails();
      this.MfaEnableBefore = user?.mfaEnable;
      this.profileForm.patchValue({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        status: user?.status,
        mfaEnable: user?.mfaEnable,
      });
      this.loader.stop();
    } catch (error: any) {
      this.toast.error(error?.error?.message);
    }
  }

  logout() {
    this.loader.start();
    this.localStorageService.removeItem("token");
    this.router.navigate(["/auth/login"]);
    this.loader.stop();
  }

  resetPassword(email: string) {
    this.router.navigate(["/auth/reset-password"], {
      state: { email: email },
    });
  }

  async updateProfile() {
    try {
      console.log(this.MfaEnableBefore);
      console.log(this.profileForm.value);
      const payload = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        ...(this.MfaEnableBefore &&
          !this.profileForm.value.mfaEnable && { mfaEnable: false }),
        ...(!this.MfaEnableBefore &&
          this.profileForm.value.mfaEnable && {
            mfaSecter: "",
            mfaEnable: false,
          }),
      };
      console.log(payload);
      console.log(this.profileForm.getRawValue().email);
      this.loader.start();
      const updateUser = await this.apiService.updateProfile(payload);
      this.loader.stop();
      if (updateUser?.success) {
        if (!this.MfaEnableBefore && this.profileForm.value.mfaEnable) {
          this.router.navigate(["/auth/setup-mfa"]);
          return;
        }
        await this.getUserProfile();
        this.toast.success(updateUser?.message);
      }
    } catch (error: any) {
      console.error(error?.error?.message);
    }
  }
}
