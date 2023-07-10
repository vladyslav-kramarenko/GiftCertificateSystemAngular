import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CertificateService} from "../shared/services/certificate.service";
import {CartService} from "../shared/services/cart.service";
import {Router} from '@angular/router';
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../shared/services/auth.service";
import {SearchService} from '../shared/services/SearchService';
import {environment} from '../../environments/environment';
import {ImageService} from "../shared/services/image.service";

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateInfoComponent implements OnInit {
  certificate: any;
  certificateImage = environment.default_certificate_image;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private certificateService: CertificateService,
    private cartService: CartService,
    private searchService: SearchService,
    private authService: AuthService,
    private imageService: ImageService
  ) {
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.certificateService.getCertificate(id).subscribe(
        loadedCertificate => {
          this.certificate = loadedCertificate;
          if (this.certificate.img) {
            console.log("this.certificate.img = " + this.certificate.img)
            this.imageService.getImage(this.certificate.img).subscribe((data: Blob) => {
              const urlCreator = window.URL || window.webkitURL;
              console.log("urlCreator = " + urlCreator);
              this.certificateImage = urlCreator.createObjectURL(data);
            });
          }
        },
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

  isManagerOrAdmin(): boolean {
    return this.authService.isManagerOrAdmin();
  }

  onTagClick(tagName: string): void {
    this.searchService.setSearchTerm(tagName);
    this.router.navigate(['/home']);
  }
}
