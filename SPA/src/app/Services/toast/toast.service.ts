import { Injectable } from '@angular/core';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor(private toastrService: NbToastrService) {}

    success(message: any) {
        const status: NbComponentStatus = 'success';
        this.toastrService.show(message, 'SUCCESS', {
            preventDuplicates: true,
            status,
            duration: 5000,
        });
    }

    error(message: string) {
        const status: NbComponentStatus = 'danger';
        this.toastrService.show(message, 'ERROR', {
            preventDuplicates: true,
            status,
            icon: 'close-outline',
        });
    }

    info(message: string) {
        const status: NbComponentStatus = 'info';
        this.toastrService.show(message, 'Info', {
            preventDuplicates: true,
            status,
            icon: 'close-outline',
        });
    }
}
