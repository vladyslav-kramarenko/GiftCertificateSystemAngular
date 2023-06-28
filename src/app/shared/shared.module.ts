import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {RouterLink} from "@angular/router";
import {AppScrollButtonsComponent} from './app-scroll-buttons/app-scroll-buttons.component';
import { FavoriteButtonComponent } from './favorite-button/favorite-button.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AppScrollButtonsComponent,
    FavoriteButtonComponent
  ],
  imports: [
    CommonModule,
    RouterLink
  ],
    exports: [
        HeaderComponent,
        FooterComponent,
        AppScrollButtonsComponent,
        FavoriteButtonComponent
    ]
})
export class SharedModule {
}
