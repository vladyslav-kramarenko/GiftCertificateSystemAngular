import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { RegisterComponent } from './auth/register/register.component';
import { CertificateComponent } from './certificate/certificate.component';
import { CertificatesComponent } from './certificates/certificates.component';

const routes: Routes = [
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: CertificatesComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'certificates/:id', component: CertificateComponent },
  { path: 'error/:errorCode/:errorMessage', component: ErrorPageComponent },
  { path: '**', redirectTo: '/error/404/Page not found' },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
