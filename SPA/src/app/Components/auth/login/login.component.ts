import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/Services/api/api.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { LocalstorageService } from 'src/app/Services/localstorage/localstorage.service';
import { ToastService } from 'src/app/Services/toast/toast.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
    loginForm: FormGroup;
    loginSubscription: Subscription | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private toast: ToastService,
        private router: Router,
        private localStorageService: LocalstorageService,
        private loader: LoaderService,
    ) {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            password: ['', [Validators.required]],
        });
    }

    login() {
        this.loader.start();
        this.loginSubscription = this.apiService.login(this.loginForm.value)?.subscribe(
            (loginResponse) => {
                this.loader.stop();
                if (loginResponse?.success) {
                    this.localStorageService.setItem('token', loginResponse?.userData?.token);
                    if (loginResponse?.userData?.mfaEnable) {
                        this.router.navigate(['/auth/mfa-verification'], {
                            state: {
                                email: this.loginForm.value.email,
                                redirection: '/profile',
                            },
                        });
                        return;
                    } else {
                        this.router.navigate(['/auth/setup-mfa']);
                    }
                    return;
                }
                this.toast.error(loginResponse?.message);
            },
            (error) => {
                this.loader.stop();
                this.toast.error(error?.error?.message);
            },
        );
    }

    ngOnDestroy(): void {
        this.loginSubscription?.unsubscribe();
    }
}
