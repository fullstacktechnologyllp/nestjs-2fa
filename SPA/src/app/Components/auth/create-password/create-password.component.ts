import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/Services/api/api.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { ToastService } from 'src/app/Services/toast/toast.service';

@Component({
    selector: 'app-create-password',
    templateUrl: './create-password.component.html',
    styleUrls: ['./create-password.component.scss'],
})
export class CreatePasswordComponent implements OnDestroy {
    createPasswordForm: FormGroup;
    currentEmail: string = history.state?.email;
    createPasswordSubscription: Subscription | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private toast: ToastService,
        private router: Router,
        private loader: LoaderService,
    ) {
        this.createPasswordForm = this.formBuilder.group({
            newPassword: ['', [Validators.required]],
            confirmNewPassword: ['', [Validators.required]],
        });
    }

    createNewPassword() {
        if (this.createPasswordForm.valid) {
            const payload = {
                email: this.currentEmail,
                newPassword: this.createPasswordForm.value.newPassword,
            };
            this.loader.start();
            this.createPasswordSubscription = this.apiService.createPassword(payload)?.subscribe(
                (createPasswordResponse) => {
                    this.loader.stop();
                    if (createPasswordResponse?.success) {
                        this.toast.success(createPasswordResponse.message);
                        this.router.navigate(['/auth/login']);
                        return;
                    }
                    this.toast.error(createPasswordResponse?.message);
                },
                (error) => {
                    this.loader.stop();
                    this.toast.error(error?.error?.message);
                },
            );
        }
    }

    ngOnDestroy(): void {
        this.createPasswordSubscription?.unsubscribe();
    }
}
