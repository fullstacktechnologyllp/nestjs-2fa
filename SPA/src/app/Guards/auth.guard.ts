import { Injectable } from "@angular/core";
import { CanActivate, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { LocalstorageService } from "../Services/localstorage/localstorage.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private localStorageService: LocalstorageService) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.localStorageService.getItem("token");
    if (token === undefined || token === null) {
      return false;
    }
    return true;
  }
}
