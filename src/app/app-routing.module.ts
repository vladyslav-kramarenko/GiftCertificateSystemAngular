import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {CertificateComponent} from "./certificate/certificate.component";
import {ErrorPageComponent} from "./error-page/error-page.component";
import {CartComponent} from "./cart/cart.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'cart', component: CartComponent},
  {path: 'certificates/:id', component: CertificateComponent},
  {path: 'error/:errorCode/:errorMessage', component: ErrorPageComponent},
  {path: '**', redirectTo: '/error/404/Page not found'}
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
