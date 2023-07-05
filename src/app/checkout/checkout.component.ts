import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {CartService} from '../shared/services/cart.service';
import {CertificateService} from '../shared/services/certificate.service';
import {Router} from '@angular/router';
import {forkJoin} from "rxjs";
import {map} from "rxjs/operators";
import {Certificate} from "../shared/models/ICertificate";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  user: any;
  cart: { certificate: Certificate, quantity: number }[] = [];

  firstName: string = '';
  lastName: string = '';
  email: string = '';

  constructor(
    private certificateService: CertificateService,
    private authService: AuthService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
  }


  ngOnInit() {
    const userId = this.authService.getUserId();

    if (userId) {
      console.log("userId = " + userId);
      this.getUserData(userId);
    } else {
      console.log("userId is null");
    }
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');

    forkJoin<{ certificate: Certificate, quantity: number }[]>(this.getCartItemsData(cartData)).subscribe((cartItems) => {
      this.cart = cartItems;
    });
  }

  getCartItemsData(cartData: { id: number, quantity: number }[]) {
    return cartData.map((item: { id: number, quantity: number }) => {
      return this.certificateService.getCertificate(item.id)
        .pipe(map(certificate => ({
          certificate: certificate,
          quantity: item.quantity
        })));
    });
  }


  getUserData(userId: number): void {
    this.authService.getUserDetails(userId).subscribe(user => {
      this.user = user;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.email = user.email;
      // this.orders = user.orders;
    });
  }


  getTotalCost() {
    return this.cart.reduce((total, item) => {
      return total + item.certificate.price * item.quantity;
    }, 0);
  }

  placeOrder() {
    const giftCertificates = this.cart.map(item => ({
      giftCertificateId: item.certificate.id,
      quantity: item.quantity
    }));
    this.cartService.createOrder(this.user.id, giftCertificates).subscribe(() => {

      this.cart = [];
      localStorage.setItem('cart', JSON.stringify(this.cart));

      console.log('Order has been placed!');
      this.snackBar.open('Order has been placed!', 'Close', {
        duration: 2000,
      });

      this.router.navigate(['/cart']);
    }, error => {
      this.snackBar.open('Error placing order: ' + error, 'Close', {
        duration: 2000,
      });
      console.error('Error placing order:', error);
    });
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }
}
