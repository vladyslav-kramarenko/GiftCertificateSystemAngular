import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { CertificatesComponent } from './certificates/certificates.component';
import { CertificateInfoComponent } from './certificate-info/certificate.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AppComponent } from './app.component';
import { CartComponent } from './cart/cart.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CertificateEditComponent } from './certificate-edit/certificate-edit.component';

@NgModule({
  declarations: [
    CertificateEditComponent,
    CertificateInfoComponent,
    CertificatesComponent,
    ErrorPageComponent,
    FavoritesComponent,
    CheckoutComponent,
    CartComponent,
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    AppRoutingModule,
    MatButtonModule,
    MatInputModule,
    BrowserModule,
    MatCardModule,
    MatIconModule,
    SharedModule,
    FormsModule,
    AuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
