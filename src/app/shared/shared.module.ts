import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {RouterLink} from "@angular/router";
import {AppScrollButtonsComponent} from './app-scroll-buttons/app-scroll-buttons.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AppScrollButtonsComponent
  ],
  imports: [
    CommonModule,
    RouterLink
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AppScrollButtonsComponent
  ]
})
export class SharedModule {
}
