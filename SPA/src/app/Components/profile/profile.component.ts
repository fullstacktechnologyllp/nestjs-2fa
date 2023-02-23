import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/Services/api/api.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { LocalstorageService } from 'src/app/Services/localstorage/localstorage.service';
import { ToastService } from 'src/app/Services/toast/toast.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
    profileForm: FormGroup;
    MfaEnableBefore: boolean;
    userDetailSubscription: Subscription | undefined;
    updateUserSubscription: Subscription | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private localStorageService: LocalstorageService,
        private toast: ToastService,
        private router: Router,
        private loader: LoaderService,
    ) {
        this.MfaEnableBefore = false;
        this.profileForm = this.formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: [{ value: '', disabled: true }, [Validators.required]],
            status: [{ value: '', disabled: true }],
            mfaEnable: [''],
        });
    }

    async ngOnInit() {
        this.getUserProfile();
    }

    getUserProfile() {
        this.loader.start();
        this.userDetailSubscription = this.apiService.getUserDetails()?.subscribe(
            (user) => {
                this.MfaEnableBefore = user?.mfaEnable;
                this.profileForm.patchValue({
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    email: user?.email,
                    status: user?.status,
                    mfaEnable: user?.mfaEnable,
                });
                this.loader.stop();
            },
            (error) => {
                this.loader.stop();
                this.toast.error(error?.error?.message);
            },
        );
    }

    logout() {
        this.loader.start();
        this.localStorageService.removeItem('token');
        this.router.navigate(['/auth/login']);
        this.loader.stop();
    }

    resetPassword(email: string) {
        this.router.navigate(['/auth/reset-password'], {
            state: { email: email },
        });
    }

    updateProfile() {
        const payload = {
            firstName: this.profileForm.value.firstName,
            lastName: this.profileForm.value.lastName,
            ...(this.MfaEnableBefore && !this.profileForm.value.mfaEnable && { mfaEnable: false }),
            ...(!this.MfaEnableBefore &&
                this.profileForm.value.mfaEnable && {
                    mfaSecter: '',
                    mfaEnable: false,
                }),
        };
        this.loader.start();
        this.updateUserSubscription = this.apiService.updateProfile(payload)?.subscribe(
            (updateUserRespone) => {
                this.loader.stop();
                if (updateUserRespone?.success) {
                    if (!this.MfaEnableBefore && this.profileForm.value.mfaEnable) {
                        this.router.navigate(['/auth/setup-mfa']);
                        return;
                    }
                    this.getUserProfile();
                    this.toast.success(updateUserRespone?.message);
                }
            },
            (error) => {
                this.loader.stop();
                this.toast.error(error?.error?.message);
            },
        );
    }

    ngOnDestroy(): void {
        this.userDetailSubscription?.unsubscribe();
        this.updateUserSubscription?.unsubscribe();
    }
}
