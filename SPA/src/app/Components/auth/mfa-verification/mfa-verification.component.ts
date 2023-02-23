import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/Services/api/api.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { ToastService } from 'src/app/Services/toast/toast.service';

@Component({
    selector: 'app-mfa-verification',
    templateUrl: './mfa-verification.component.html',
    styleUrls: ['./mfa-verification.component.scss'],
})
export class MfaVerificationComponent implements OnDestroy {
    otpForm: FormGroup;
    currentEmail: string = history.state?.email;
    mfaSubscription: Subscription | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private router: Router,
        private toast: ToastService,
        private loader: LoaderService,
    ) {
        this.otpForm = this.formBuilder.group({
            otp: ['', [Validators.required]],
        });
    }

    mfaVerification() {
        if (this.otpForm.controls['otp'].value) {
            this.loader.start();
            const payload = {
                otp: this.otpForm.controls['otp'].value,
                email: history?.state?.email,
            };
            this.mfaSubscription = this.apiService.otpVerification(payload)?.subscribe(
                (otpVerification) => {
                    this.loader.stop();
                    if (otpVerification?.success) {
                        this.toast.success(otpVerification?.message);
                        this.router.navigate([history?.state?.redirection], {
                            state: { email: history?.state?.email },
                        });
                    }
                },
                (error) => {
                    this.loader.stop();
                    this.toast.error(error?.error?.message);
                },
            );
        }
    }

    ngOnDestroy(): void {
        this.mfaSubscription?.unsubscribe();
    }
}
