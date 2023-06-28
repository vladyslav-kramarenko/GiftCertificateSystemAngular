import {Component, Input} from '@angular/core';
import {FavoriteService} from '../services/favorite.service';

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.component.html',
  styleUrls: ['./favorite-button.component.scss']
})
export class FavoriteButtonComponent {
  @Input() itemId: number = 0;
  isFavorite: boolean = false;

  constructor(private favoriteService: FavoriteService) {

  }

  ngOnInit() {
    this.isFavorite = this.favoriteService.isFavorite(this.itemId.toString());
  }

  toggleFavorite(): void {
    if (this.isFavorite) {
      this.favoriteService.removeFromFavorites(this.itemId.toString());
    } else {
      this.favoriteService.addToFavorites(this.itemId.toString());
    }
    this.isFavorite = !this.isFavorite;
  }
}
