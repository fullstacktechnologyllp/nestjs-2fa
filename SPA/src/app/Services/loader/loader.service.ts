import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: "root",
})
export class LoaderService {
  constructor(private spinner: NgxSpinnerService) {}

  start() {
    this.spinner.show();
  }

  stop() {
    this.spinner.hide();
  }
}
