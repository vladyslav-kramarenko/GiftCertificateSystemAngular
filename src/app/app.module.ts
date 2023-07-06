import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

import {AuthModule} from './auth/auth.module';
import {SharedModule} from './shared/shared.module';
import {AppRoutingModule} from './app-routing.module';

import {CertificateEditComponent} from './certificate-edit/certificate-edit.component';
import {CertificateInfoComponent} from './certificate-info/certificate.component';
import {CertificatesComponent} from './certificates/certificates.component';
import {UserOrdersComponent} from './user-orders/user-orders.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {FavoritesComponent} from './favorites/favorites.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {CartComponent} from './cart/cart.component';
import {AppComponent} from './app.component';

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
    UserOrdersComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserModule,
    SharedModule,
    FormsModule,
    AuthModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
