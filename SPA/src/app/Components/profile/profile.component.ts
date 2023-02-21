import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "src/app/Services/api/api.service";
import { LoaderService } from "src/app/Services/loader/loader.service";
import { LocalstorageService } from "src/app/Services/localstorage/localstorage.service";
import { ToastService } from "src/app/Services/toast/toast.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private localStorageService: LocalstorageService,
    private toast: ToastService,
    private router: Router,
    private loader: LoaderService
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required]],
      status: [""],
      mfaEnable: [""],
    });
    this.profileForm.controls["email"].disable();
    this.profileForm.controls["status"].disable();
  }

  async ngOnInit() {
    try {
      const user = await this.apiService.getUserDetails();
      this.profileForm.patchValue({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        status: user?.status,
        mfaEnable: user?.mfaEnable,
      });
    } catch (e: any) {
      setTimeout(() => {
        this.toast.error(e.error.message);
      }, 1000);
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
      const payload = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        mfaEnable: this.profileForm.value.mfaEnable,
      };
      console.log(payload);
      const updateUser = await this.apiService.updateProfile(payload);
      if (updateUser?.success) {
        setTimeout(() => {
          this.toast.success(updateUser?.message);
        }, 1000);
      }
    } catch (error: any) {
      console.error(error?.error?.message);
    }
  }
}
