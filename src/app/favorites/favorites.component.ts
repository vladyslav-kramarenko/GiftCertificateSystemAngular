import {Component, OnInit} from '@angular/core';
import {FavoriteService} from '../shared/services/favorite.service';
import {CertificateService} from '../shared/services/certificate.service';
import {CartService} from '../shared/services/cart.service';
import {Certificate} from '../shared/models/ICertificate';
import {catchError, forkJoin, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  favorites: Certificate[] = [];
  loading: boolean = false;
  allLoaded: boolean = false;

  constructor(
    private certificateService: CertificateService,
    private favoriteService: FavoriteService,
    private cartService: CartService,
  ) {
  }

  ngOnInit(): void {
    this.loadMoreCertificates();
  }

  loadMoreCertificates(): void {
    if (!this.loading && !this.allLoaded) {
      this.loading = true;

      this.favoriteService.getFavorites().subscribe(favoriteIds => {
        const loadIds = favoriteIds.slice(this.favorites.length, this.favorites.length + 10);
        if (loadIds.length > 0) {
          this.getCertificates(loadIds).subscribe(certificates => {
            this.favorites = [...this.favorites, ...certificates];
            this.loading = false;
          });
        } else {
          this.allLoaded = true;
          this.loading = false;
        }
      });
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

  onTileClick(event: Event) {
    const tileElement = (event.target as Element).closest('.certificate-tile');
    if (tileElement) {
      tileElement.classList.add('clicked');
      setTimeout(() => {
        tileElement.classList.remove('clicked');
      }, 200);
    }
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
