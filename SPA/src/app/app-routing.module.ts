import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./Guards/auth.guard";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      import("./Components/auth/auth.module").then((m) => m.NgxAuthModule),
  },
  {
    path: "profile",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./Components/profile/profile.module").then(
        (m) => m.ProfileModule
      ),
  },
  { path: "**", redirectTo: "auth", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
