import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocalstorageService {
    setItem(key: string, value: any) {
        localStorage.setItem(key, value);
    }

    getItem(key: string) {
        const value: any = localStorage.getItem(key);
        return value;
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
    }
}
