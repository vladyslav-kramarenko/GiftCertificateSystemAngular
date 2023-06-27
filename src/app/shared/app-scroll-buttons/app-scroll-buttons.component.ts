import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-app-scroll-buttons',
  templateUrl: './app-scroll-buttons.component.html',
  styleUrls: ['./app-scroll-buttons.component.scss']
})
export class AppScrollButtonsComponent {
  scrollReturnButtonVisible: boolean = false;
  backToTopButtonVisible: boolean = false;

  @HostListener('window:scroll', [])
  onScroll() {
    this.scrollFunction();
  }

  scrollFunction() {
    if (window.pageYOffset > 20) {
      this.scrollReturnButtonVisible = false;
      this.backToTopButtonVisible = true;
    } else {
      this.scrollReturnButtonVisible = true;
      this.backToTopButtonVisible = false;
    }
  }

  returnScroll() {
    const scrollPosition = localStorage.getItem('scrollPosition');
    window.scrollTo(0, Number(scrollPosition));
    localStorage.removeItem('scrollPosition');
  }

  topFunction() {
    localStorage.setItem('scrollPosition', String(window.scrollY));
    console.log("scrollPosition = " + window.scrollY);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
}
