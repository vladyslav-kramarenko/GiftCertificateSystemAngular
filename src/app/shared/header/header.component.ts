import {Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import {SearchService} from "../services/SearchService";
import {AuthService} from '../services/auth.service';
import {Observable,  Subscription} from 'rxjs';
import {NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  private subscriptions: Subscription[] = [];
  dropdownVisible = false;
  userId: number | null = null;

  constructor(
    public authService: AuthService,
    private searchService: SearchService,
    private router: Router,
    private eRef: ElementRef,
  ) {
  }

  ngOnInit(): void {
    this.loadUserId();

    this.subscriptions.push(
      this.searchService.searchTerm$.subscribe(term => {
        this.searchTerm = term;
      }),
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.dropdownVisible = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownVisible = false;
    }
  }

  onSearchTermChange(): void {
    this.searchService.setSearchTerm(this.searchTerm);
    this.router.navigate(['/']);
  }

  onLogoutClick() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadUserId(): void {
    this.userId = this.authService.getUserId();
  }

  isManagerOrAdmin(): boolean {
    return this.authService.isManagerOrAdmin();
  }

  isAuthorized(): Observable<boolean> {
    return this.authService.isLoggedIn();
  }

  goHome(){
    this.router.navigate(['/']);
    this.searchService.setSearchTerm("");
  }
}
