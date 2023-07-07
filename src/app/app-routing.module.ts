import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import {CertificateEditComponent} from './certificate-edit/certificate-edit.component';
import {CertificateInfoComponent} from './certificate-info/certificate.component';
import {CertificatesComponent} from './certificates/certificates.component';
import {UserOrdersComponent} from "./user-orders/user-orders.component";
import {ErrorPageComponent} from './error-page/error-page.component';
import {RegisterComponent} from './auth/register/register.component';
import {FavoritesComponent} from './favorites/favorites.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {LoginComponent} from './auth/login/login.component';
import {CartComponent} from './cart/cart.component';
import {AuthGuard} from "./shared/guards/auth-guard";
import {RoleGuard} from "./shared/guards/role-guard";

const routes: Routes = [
  {path: 'error/:errorCode/:errorMessage', component: ErrorPageComponent},
  {path: 'certificates/new', component: CertificateEditComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'manager']}},
  {path: 'certificates/edit/:id', component: CertificateEditComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'manager']}},
  {path: 'certificates/:id', component: CertificateInfoComponent},
  {path: 'users/:id/orders', component: UserOrdersComponent,canActivate: [AuthGuard]},
  {path: 'favorites', component: FavoritesComponent},
  {path: 'home', component: CertificatesComponent},
  {path: 'checkout', component: CheckoutComponent,canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'cart', component: CartComponent},
  {path: '**', redirectTo: '/error/404/Page not found'},
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, RoleGuard]
})
export class AppRoutingModule {
}
