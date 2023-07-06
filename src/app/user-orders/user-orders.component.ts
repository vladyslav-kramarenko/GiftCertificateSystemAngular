import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Order} from '../shared/models/IOrder';
import {OrderService} from '../shared/services/order.service';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss']
})
export class UserOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = false;
  page: number = 0;
  size: number = 10;
  id: number = 0;
  displayedColumns: string[] = ['orderId', 'sum', 'date', 'itemsCount'];

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getUserOrders(this.id, this.page, this.size).subscribe((response: any) => {
        this.orders.push(...response._embedded.orderDTOList);
        this.loading = false;
      },
      (error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  onScroll(): void {
    if (!this.loading) {
      this.page++;
      this.loadOrders();
    }
  }
}
