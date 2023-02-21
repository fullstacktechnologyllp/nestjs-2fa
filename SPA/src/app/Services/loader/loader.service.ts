import { Injectable } from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Injectable({
  providedIn: "root",
})
export class LoaderService {
  constructor(private loaderService: NgxUiLoaderService) {}

  start() {
    this.loaderService.start();
  }

  stop() {
    this.loaderService.stop();
  }
}
