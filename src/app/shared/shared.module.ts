import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {RouterModule} from "@angular/router";
import {AppScrollButtonsComponent} from './app-scroll-buttons/app-scroll-buttons.component';
import {FavoriteButtonComponent} from './favorite-button/favorite-button.component';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AppScrollButtonsComponent,
    FavoriteButtonComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AppScrollButtonsComponent,
    FavoriteButtonComponent,
    MatDialogModule,
  ]
})
export class SharedModule {
}
