import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalstorageService } from "src/app/Services/localstorage/localstorage.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  token = "";
  authUrls: Array<string> = [];
  constructor(private localStorageService: LocalstorageService) {
    this.authUrls = [
      "http://localhost:3000/user/login",
      "http://localhost:3000/user/signup",
    ];
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.authUrls.includes(request.url)) {
      return next.handle(request);
    }
    this.token = this.localStorageService.getItem("token");
    const newRequest = request.clone({
      headers: request.headers.set("Authorization", `Bearer ${this.token}`),
    });
    return next.handle(newRequest);
  }
}
