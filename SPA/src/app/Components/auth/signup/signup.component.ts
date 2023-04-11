import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ROUTES } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/Services/api/api.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { ToastService } from 'src/app/Services/toast/toast.service';
import { SignUpFormData } from 'src/app/user.interface';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnDestroy {
    signUpForm: FormGroup;
    signUpSubscription: Subscription | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private toast: ToastService,
        private router: Router,
        private loader: LoaderService,
    ) {
        this.signUpForm = this.formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]],
        });
    }

    signUp() {
        if (this.signUpForm.valid && this.signUpForm.value.password === this.signUpForm.value.confirmPassword) {
            const userData: SignUpFormData = {
                firstName: this.signUpForm.value.firstName,
                lastName: this.signUpForm.value.lastName,
                email: this.signUpForm.value.email,
                password: this.signUpForm.value.password,
                status: 'inactive',
            };
            this.loader.start();
            this.signUpSubscription = this.apiService.signUp(userData)?.subscribe(
                (signUpResponse) => {
                    this.loader.stop();
                    if (signUpResponse.success) {
                        this.toast.success(signUpResponse.message);
                        this.router.navigate([ROUTES.LOGIN]);
                        return;
                    } else {
                        this.toast.error(signUpResponse.message);
                        return;
                    }
                },
                (error) => {
                    this.loader.stop();
                    console.log(error);
                    this.toast.error(error?.error?.message);
                },
            );
        }
    }

    ngOnDestroy(): void {
        this.signUpSubscription?.unsubscribe();
    }
}
