import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ROUTES } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/Services/api/api.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { ToastService } from 'src/app/Services/toast/toast.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnDestroy {
    resetPasswordForm: FormGroup;
    currentEmail: string = history.state?.email;
    resetPasswordSubscription: Subscription | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private toast: ToastService,
        private router: Router,
        private loader: LoaderService,
    ) {
        this.resetPasswordForm = this.formBuilder.group({
            oldPassword: ['', [Validators.required]],
            newPassword: ['', [Validators.required]],
            confirmNewPassword: ['', [Validators.required]],
        });
    }

    resetPassword() {
        this.loader.start();
        const payload = {
            password: this.resetPasswordForm.value.oldPassword,
            newPassword: this.resetPasswordForm.value.newPassword,
        };
        this.resetPasswordSubscription = this.apiService.resetPassword(payload)?.subscribe(
            (resetPasswordResponse) => {
                this.loader.stop();
                if (resetPasswordResponse?.success) {
                    this.toast.success(resetPasswordResponse?.message);
                    this.router.navigate([ROUTES.PROFILE]);
                    return;
                } else {
                    this.toast.error(resetPasswordResponse?.message);
                }
            },
            (error) => {
                this.loader.stop();
                this.toast.error(error?.error?.message);
            },
        );
    }

    ngOnDestroy(): void {
        this.resetPasswordSubscription?.unsubscribe();
    }
}
