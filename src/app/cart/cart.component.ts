import {Component, OnInit} from '@angular/core';
import {CertificateService} from '../shared/services/certificate.service';
import {Certificate} from '../shared/models/ICertificate';
import {AuthService} from '../shared/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: { certificate: Certificate, quantity: number }[] = [];

  constructor(
    private certificateService: CertificateService,
    private authService: AuthService,
    private router: Router) {
  }

  ngOnInit(): void {
    const cartData = localStorage.getItem('cart');
    const cartIds = JSON.parse(cartData || '[]');

    cartIds.forEach((item: any) => {
      this.certificateService.getCertificate(item.id).subscribe(
        certificate => {
          if (certificate) {
            this.cart.push({
              certificate: certificate,
              quantity: item.quantity
            });
          } else {
            this.removeFromCart(item);
          }
        },
        error => {
          console.error('Error loading certificate', error);
        }
      );
    });
  }

  removeFromCart(
    item: {
      certificate: Certificate;
      quantity: number
    }
  ): void {
    const cartData = localStorage.getItem('cart');
    const cart: { id: number, quantity: number }[] = cartData ? JSON.parse(cartData) : [];
    const index = cart.findIndex((cartItem: { id: number, quantity: number }) => cartItem.id === item.certificate.id);
    if (index !== -1) {
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      const indexInCartArray = this.cart.findIndex(cartItem => cartItem.certificate.id === item.certificate.id);
      if (indexInCartArray !== -1) {
        this.cart.splice(indexInCartArray, 1);
      }
    }
  }

  getTotalPrice(): number {
    const totalPrice = this.cart.reduce(
      (
        total: number, item: {
          certificate: Certificate;
          quantity: number
        }
      ) => {
        if (item.certificate && item.certificate.price && item.quantity) {
          return total + item.certificate.price * item.quantity;
        } else {
          return total;
        }
      }, 0
    );
    return Math.round(totalPrice * 100) / 100;
  }

  changeQuantity(item: { certificate: Certificate, quantity: number }): void {
    const cartData = localStorage.getItem('cart');
    const cart: { id: number, quantity: number }[] = cartData ? JSON.parse(cartData) : [];
    const cartItem = cart.find(cartItem => cartItem.id === item.certificate.id);
    if (cartItem) {
      cartItem.quantity = item.quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
