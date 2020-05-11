import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WelcomeComponent } from "./home/welcome.component";
import { PageNotFoundComponent } from "./page-not-found.component";
import { AuthGuard } from './user/auth.guard';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: "welcome", component: WelcomeComponent },
      {
        path: 'products',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./products/product.module').then(m => m.ProductModule)
      },
      { path: "", redirectTo: "welcome", pathMatch: "full" },
      { path: "**", component: PageNotFoundComponent },
    ], { enableTracing: true }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
