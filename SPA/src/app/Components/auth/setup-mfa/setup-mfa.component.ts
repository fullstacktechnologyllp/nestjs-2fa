import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/Services/api/api.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { ToastService } from 'src/app/Services/toast/toast.service';

@Component({
    selector: 'app-setup-mfa',
    templateUrl: './setup-mfa.component.html',
    styleUrls: ['./setup-mfa.component.scss'],
})
export class SetupMfaComponent implements OnInit, OnDestroy {
    qrCodeLink = '';
    otpForm: FormGroup;
    qrCodeSubscription: Subscription | undefined;
    setupMfaSubscription: Subscription | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private apiService: ApiService,
        private toast: ToastService,
        private loader: LoaderService,
    ) {
        this.otpForm = this.formBuilder.group({
            otp: ['', [Validators.required]],
        });
    }

    ngOnInit() {
        this.loader.start();
        // this.qrCodeSubscription = this.apiService
        //     .generateQRCode()
        //     .pipe(
        //         tap((result) => {
        //             console.log(result);
        //             this.qrCodeLink = result?.qrCodeLink;
        //             console.log(this.qrCodeLink);
        //             this.loader.stop();
        //         }),
        //     )
        //     .subscribe();
        this.qrCodeSubscription = this.apiService.generateQRCode().subscribe(
            {
                next: (qrCodeResponse) => {
                    console.log(qrCodeResponse);
                    this.qrCodeLink = qrCodeResponse?.qrCodeLink;
                    console.log(this.qrCodeLink);
                    this.loader.stop();
                },
                error: (error) => {
                    this.loader.stop();
                    this.toast.error(error?.error?.message);
                },
            },
            // (qrCodeResponse) => {
            //     console.log(qrCodeResponse);
            //     this.qrCodeLink = qrCodeResponse?.qrCodeLink;
            //     console.log(this.qrCodeLink);
            //     this.loader.stop();
            // },
            // (error) => {
            //     this.loader.stop();
            //     this.toast.error(error?.error?.message);
            // },
        );
    }

    enableMFA() {
        this.loader.start();
        this.setupMfaSubscription = this.apiService.activateMFA({ otp: this.otpForm.controls['otp'].value })?.subscribe(
            (activateMFAResponse) => {
                this.loader.stop();
                if (activateMFAResponse?.success) {
                    // this.localStorageService.setItem("token", activateMFA.userData.token);
                    this.toast.success(activateMFAResponse?.message);
                    this.router.navigate(['/profile']);
                }
            },
            (error) => {
                this.loader.stop();
                this.toast.error(error?.error?.message);
            },
        );
    }

    ngOnDestroy(): void {
        this.qrCodeSubscription?.unsubscribe();
        this.setupMfaSubscription?.unsubscribe();
    }
}
