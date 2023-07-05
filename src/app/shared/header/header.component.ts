import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {SearchService} from "../services/SearchService";
import {AuthService} from '../services/auth.service';
import {Subject, Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private searchTerm = new Subject<string>();
  private subscriptions: Subscription[] = [];

  constructor(
    private searchService: SearchService,
    public authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.searchTerm.pipe(
        debounceTime(500),
        distinctUntilChanged()  // ignore if next search term is same as previous
      )
        .subscribe(search => this.searchService.setSearchTerm(search))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSearchTermChange(event: any): void {
    this.searchTerm.next(event.target.value);
  }

  onLogoutClick() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
