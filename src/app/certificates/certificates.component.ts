import {Component, OnInit, HostListener} from '@angular/core';
import {CertificateService} from '../shared/services/certificate.service';
import {CartService} from "../shared/services/cart.service";
import {Subject, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/operators';
import {SearchService} from '../shared/services/SearchService';
import {Certificate} from "../shared/models/ICertificate";

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
  sortBy: string = 'price,asc';
  searchTerm: string = '';
  minPrice: number = 0;
  maxPrice: number = 0;
  errorMessage: string = '';

  private scrollSubject = new Subject();
  private scrollSubscription?: Subscription;
  private searchTermSubscription?: Subscription;


  constructor(
    private certificateService: CertificateService,
    private cartService: CartService,
    private searchService: SearchService
  ) {
  }

  ngOnInit(): void {
    this.searchTermSubscription = this.searchService.searchTerm$.subscribe((searchTerm) => {
      this.searchTerm = searchTerm;
      this.initSearch();
    });

    this.certificateService.error$.subscribe(errorMessage => {
      this.errorMessage = errorMessage;
    });

    this.scrollSubscription = this.scrollSubject.pipe(
      throttleTime(200)
    ).subscribe(() => {
      this.loadMoreResults(10);
    });
  }

  loadMoreResults(size: number) {
    this.errorMessage = '';
    const sortParams = this.sortBy.split(',').map(s => s.trim());
    console.log('loadMoreResults started');
    console.log('size = '+size);
    this.loading = true;
    this.certificateService.searchGiftCertificates(
      this.searchTerm,
      this.page,
      size || this.size,
      sortParams,
      this.minPrice || 0,
      this.maxPrice || 0)
      .subscribe((certificates: Certificate[]) => {
        if (certificates === null || certificates === undefined || certificates.length === 0) {
          console.log('No certificates found');
          this.errorMessage = "No certificates found";
        } else {
          this.certificates = this.certificates.concat(certificates);
          console.log('found '+certificates.length+" certificates");
          this.page++;
        }
      });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    const currentPosition = window.pageYOffset;
    const maxPosition = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (currentPosition >= maxPosition) {
      this.loadMoreResults(10);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
    if (this.searchTermSubscription) {
      this.searchTermSubscription.unsubscribe();
    }
  }

  initSearch() {
    console.log("initSearch()");
    // Reset to initial state
    this.certificates = [];
    this.page = 0;
    this.allLoaded = false;

    this.loadMoreResults(30);
  }

  addToCart(id: number): void {
    this.cartService.addToCart(id);
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
