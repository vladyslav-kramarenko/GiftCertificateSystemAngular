import {Component, OnInit} from '@angular/core';
import {FavoriteService} from '../shared/services/favorite.service';
import {CertificateService} from '../shared/services/certificate.service';
import {CartService} from '../shared/services/cart.service';
import {Certificate} from '../shared/models/ICertificate';
import {catchError, forkJoin, Observable, of, Subject, Subscription} from 'rxjs';
import {throttleTime, map} from 'rxjs/operators';
import {HostListener} from '@angular/core';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  favorites: Certificate[] = [];
  loading: boolean = false;
  allLoaded: boolean = false;

  private scrollSubject = new Subject();
  private scrollSubscription?: Subscription;
  private page: number = 0;

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const currentPosition = window.pageYOffset;
    const maxPosition = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (currentPosition >= maxPosition) {
      this.loadMoreCertificates();
    }
  }

  constructor(
    private certificateService: CertificateService,
    private favoriteService: FavoriteService,
    private cartService: CartService,
  ) {
  }

  ngOnInit(): void {
    this.loadMoreCertificates();
    this.scrollSubscription = this.scrollSubject.pipe(
      throttleTime(200)
    ).subscribe(() => {
      this.loadMoreCertificates();
    });
  }

  loadMoreCertificates(): void {
    if (!this.loading && !this.allLoaded) {
      this.loading = true;

      this.favoriteService.getFavorites(this.page, 10).subscribe(favoriteIds => {
        if (favoriteIds.length > 0) {
          this.getCertificates(favoriteIds).subscribe(certificates => {
            this.favorites = [...this.favorites, ...certificates];
            this.loading = false;
          });
        } else {
          this.allLoaded = true;
          this.loading = false;
        }
      });
      this.page++;
    }
  }

  getCertificates(ids: string[]): Observable<Certificate[]> {
    return forkJoin(ids.map(id => this.certificateService.getCertificate(+id).pipe(
      catchError(error => {
        console.error(`Failed to get certificate with id: ${id}`, error);
        return of(null); // Emit null for failed requests
      })
    ))).pipe(
      map(results => results.filter(result => result !== null)) // Filter out null results
    );
  }

  addToCart(id: number): void {
    this.cartService.addToCart(id);
  }

  onTileMouseDown(event: Event) {
    const tileElement = (event.target as Element).closest('.certificate-tile');
    if (tileElement) {
      tileElement.classList.add('clicked');
    }
  }

  onTileMouseUp(event: Event) {
    const tileElement = (event.target as Element).closest('.certificate-tile');
    if (tileElement) {
      tileElement.classList.remove('clicked');
    }
  }
}
