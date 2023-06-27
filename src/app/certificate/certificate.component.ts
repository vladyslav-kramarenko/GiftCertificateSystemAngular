import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CertificateService} from "../shared/services/certificate.service";
import {CartService} from "../shared/services/cart.service";
import {Router} from '@angular/router';
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements OnInit {
  certificate: any;

  constructor(
    private route: ActivatedRoute,
    private certificateService: CertificateService,
    private cartService: CartService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.certificateService.getCertificate(id).subscribe(
        data => this.certificate = data,
        (error: HttpErrorResponse) => {
          // handle error when certificate not found
          let errorMessage;
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
          this.router.navigateByUrl(`/error/${error.status}/${errorMessage}`);
        }
      );
    } else {
      // redirect to 404 error page when 'id' parameter is not available
      this.router.navigateByUrl('/error/400/Bad Request');
    }
  }

  addToCart(): void {
    this.cartService.addToCart(this.certificate.id);
  }
}
