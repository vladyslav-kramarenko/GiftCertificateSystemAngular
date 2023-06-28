import {Component, OnInit} from '@angular/core';
import {CertificateService} from '../shared/services/certificate.service';
import {forkJoin} from "rxjs";
import {Certificate} from '../models/ICertificate';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: { certificate: Certificate, quantity: number }[] = [];

  constructor(private certificateService: CertificateService) {
  }

  ngOnInit(): void {
    const cartData = localStorage.getItem('cart');
    const cartIds = JSON.parse(cartData || '[]');

    cartIds.forEach((item: any) => {
      this.certificateService.getCertificate(item.id).subscribe(
        certificate => {
          this.cart.push({
            certificate: certificate,
            quantity: item.quantity
          });
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
    return Math.round(
      this.cart.reduce(
        (
          total: number, item: {
            certificate: Certificate;
            quantity: number
          }
        ) => total + item.certificate.price * item.quantity, 0
      )
    );
  }

  changeQuantity(item: {certificate: Certificate, quantity: number}): void {
    const cartData = localStorage.getItem('cart');
    const cart: {id: number, quantity: number}[] = cartData ? JSON.parse(cartData) : [];
    const cartItem = cart.find(cartItem => cartItem.id === item.certificate.id);
    if (cartItem) {
      cartItem.quantity = item.quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }


  updateCart(): void {
    const cartData = localStorage.getItem('cart');
    const cart: {
      id: number, quantity: number
    }[] = cartData ? JSON.parse(cartData) : [];
    const requests = cart.map(itemId => this.certificateService.getCertificate(itemId.id));
    forkJoin(requests).subscribe(
      (responses: Certificate[]) => {
        this.cart = responses.map((item, index) => ({
            certificate: item,
            quantity: cart.filter(itemId => itemId.id === item.id).length
          })
        );
      }
    );
  }
}
