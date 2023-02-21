import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "src/app/Services/api/api.service";
import { ToastService } from "src/app/Services/toast/toast.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent {
  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toast: ToastService,
    private router: Router
  ) {
    this.signUpForm = this.formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      password: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
    });
  }

  async signUp() {
    if (
      this.signUpForm.valid &&
      this.signUpForm.value.password === this.signUpForm.value.confirmPassword
    ) {
      try {
        const userData = {
          firstName: this.signUpForm.value.firstName,
          lastName: this.signUpForm.value.lastName,
          email: this.signUpForm.value.email,
          password: this.signUpForm.value.password,
          status: "inactive",
        };
        const signUpResponse = await this.apiService.signUp(userData);
        if (signUpResponse.success) {
          setTimeout(() => {
            this.toast.success(signUpResponse.message);
            this.router.navigate(["/login"]);
          }, 1000);

          return;
        } else {
          setTimeout(() => {
            this.toast.error(signUpResponse.message);
          }, 1000);
          return;
        }
      } catch (e: any) {
        setTimeout(() => {
          this.toast.error(e.error.message);
        }, 1000);
      }
    }
  }
}
