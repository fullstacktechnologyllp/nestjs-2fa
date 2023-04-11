import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticateType, ROUTES } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/Services/api/api.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { ToastService } from 'src/app/Services/toast/toast.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnDestroy {
    emailForm: FormGroup;
    forgotPasswordSubscription: Subscription | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private toast: ToastService,
        private router: Router,
        private loader: LoaderService,
    ) {
        this.emailForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        });
    }

    forgotPassword() {
        this.loader.start();
        this.forgotPasswordSubscription = this.apiService.forgotPassword(this.emailForm.value)?.subscribe(
            (forgotPasswordResponse) => {
                this.loader.stop();
                if (forgotPasswordResponse?.success) {
                    this.toast.success('Please authenticate for Reset Password');
                    this.router.navigate([ROUTES.MFA_VERIFICATION], {
                        state: {
                            email: this.emailForm.value.email,
                            redirection: ROUTES.CREATE_PASSWORD,
                            type: forgotPasswordResponse?.userData?.mfaEnable ? AuthenticateType.APP : AuthenticateType.EMAIL,
                        },
                    });
                    return;
                }
                if (forgotPasswordResponse?.message && !forgotPasswordResponse?.success) {
                    this.toast.error(forgotPasswordResponse?.message);
                }
            },
            (error) => {
                this.loader.stop();
                this.toast.error(error?.error?.message);
            },
        );
    }

    ngOnDestroy(): void {
        this.forgotPasswordSubscription?.unsubscribe();
    }
}
