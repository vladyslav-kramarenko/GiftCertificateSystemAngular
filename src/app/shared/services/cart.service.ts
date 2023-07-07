import {BehaviorSubject} from 'rxjs';
import {Injectable} from "@angular/core";
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class CartService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
  }

  private _itemCount = new BehaviorSubject<number>(0);

  get itemCount() {
    return this._itemCount.asObservable();
  }

  addToCart(id: number) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // check if item is already in the cart
    let item = cart.find((i: any) => i.id === id);

    if (item) {
      item.quantity++;
    } else {
      cart.push({
        id: id,
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    this.snackBar.open('Item added to cart', 'Close', {
      duration: 2000,
    });

    this._itemCount.next(this._itemCount.value + 1);
  }

  removeFromCart(item: any) {
    this._itemCount.next(this._itemCount.value - 1);
  }
}
