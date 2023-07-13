import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {Order} from "../models/IOrder";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getUserOrders(id: number, page: number, size: number): Observable<Order[]> {
    const url = `${environment.API_URL}/users/${id}/orders`;
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<Order[]>(url, { params});
  }


  createOrder(userId: number, giftCertificates: any[]) {
    console.log(giftCertificates);
    const url = `${environment.API_URL}/orders`;
    return this.http.post(url, {userId, giftCertificates});
  }
}
