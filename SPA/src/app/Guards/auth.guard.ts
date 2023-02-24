import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalstorageService } from '../Services/localstorage/localstorage.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private localStorageService: LocalstorageService, private router: Router) {}
    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const token = this.localStorageService.getItem('token');
        if (token === undefined || token === null) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
