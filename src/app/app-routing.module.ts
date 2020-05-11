import { SelectiveStrategy } from './selective-strategy.service';
import { NgModule } from "@angular/core";
import { RouterModule, Routes, PreloadAllModules } from "@angular/router";
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
        canActivate: [AuthGuard],//use when preload or normal case
        //canLoad: [AuthGuard],//use when lazyload
        data: { preload: true },
        loadChildren: () =>
          import('./products/product.module').then(m => m.ProductModule)
      },
      { path: "", redirectTo: "welcome", pathMatch: "full" },
      { path: "**", component: PageNotFoundComponent },
    ], {
      enableTracing: true,
      //preloadingStrategy: PreloadAllModules //for preloading all routes
      preloadingStrategy: SelectiveStrategy
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
