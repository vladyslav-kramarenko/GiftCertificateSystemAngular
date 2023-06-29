import {Component, OnInit, HostListener} from '@angular/core';
import {CertificateService} from '../shared/services/certificate.service';
import {CartService} from "../shared/services/cart.service";
import {Subject, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/operators';


@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent implements OnInit {
  certificates: any = [];
  loading = false;
  allLoaded = false;
  page = 0;
  size = 10;

  private scrollSubject = new Subject();
  private scrollSubscription?: Subscription;


  constructor(
    private certificateService: CertificateService,
    private cartService: CartService
  ) {
  }

  ngOnInit(): void {
    this.scrollSubscription = this.scrollSubject.pipe(
      throttleTime(200) // Adjust this value to your needs
    ).subscribe(() => {
      this.loadCertificates();
    });
    this.loadCertificates();
  }

  loadCertificates() {
    if (!this.allLoaded && !this.loading) {
      this.loading = true;
      this.certificateService.getCertificates(this.page, this.size).subscribe((certificates) => {
        if (certificates.length === 0) {
          this.allLoaded = true;
        } else {
          this.certificates = this.certificates.concat(certificates);
          this.page++;
        }
        this.loading = false;
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    const currentPosition = window.pageYOffset;
    const maxPosition = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (currentPosition >= maxPosition) {
      this.scrollSubject.next(true);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }


  addToCart(id: number): void {
    this.cartService.addToCart(id);
  }

  onTileClick(event: Event) {
    const tileElement = (event.target as Element).closest('.certificate-tile');
    if (tileElement) {
      tileElement.classList.add('clicked');
      setTimeout(() => {
        tileElement.classList.remove('clicked');
      }, 200);
    }
  }

  onTileMouseDown(event: Event) {
    const tileElement = (event.target as Element).closest('.certificate-tile');
    if (tileElement) {
      tileElement.classList.add('clicked');
    }
  }

  onTileMouseUp(event: Event) {
    const tileElement = (event.target as Element).closest('.certificate-tile');
    if (tileElement) {
      tileElement.classList.remove('clicked');
    }
  }
}
