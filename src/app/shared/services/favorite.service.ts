import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favorites: string[];
  private favoritesSubject: BehaviorSubject<string[]>;

  constructor() {
    const storedFavorites = localStorage.getItem('favorites');
    this.favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    this.favoritesSubject = new BehaviorSubject(this.favorites);
  }

  getFavorites(): Observable<string[]> {
    return this.favoritesSubject.asObservable();
  }

  addToFavorites(id: string): void {
    if (!this.favorites.includes(id)) {
      this.favorites.push(id);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
      this.favoritesSubject.next(this.favorites);
    }
  }

  removeFromFavorites(id: string): void {
    const index = this.favorites.indexOf(id);
    if (index > -1) {
      this.favorites.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
      this.favoritesSubject.next(this.favorites);
    }
  }

  isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }
}
