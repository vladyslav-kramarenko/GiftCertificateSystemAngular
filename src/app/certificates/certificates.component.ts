import {Component, OnInit, HostListener} from '@angular/core';
import {CertificateService} from '../shared/services/certificate.service';
import {CartService} from "../shared/services/cart.service";
import {Subject, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/operators';
import {SearchService} from '../shared/services/SearchService';
import {Certificate} from "../shared/models/ICertificate";
import {Tag} from "../shared/models/ITag";
import {TagService} from "../shared/services/tag.service";
import {environment} from "../../environments/environment";
import {ImageService} from "../shared/services/image.service";

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent implements OnInit {
  certificates: any = [];
  popularTags: Tag[] = [];
  loading = false;
  allLoaded = false;
  page = 0;
  size = 10;
  sortBy: string = 'price,asc';
  searchTerm: string = '';
  minPrice: number = 0;
  maxPrice: number = 0;
  errorMessage: string = '';
  noMoreCertificates = false;
  clickedClass: string = 'clicked';

  private scrollSubject = new Subject();
  private scrollSubscription?: Subscription;
  private searchTermSubscription?: Subscription;


  constructor(
    private certificateService: CertificateService,
    private cartService: CartService,
    private searchService: SearchService,
    private imageService: ImageService,
    private tagService: TagService
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

    this.tagService.getPopularTags(5).subscribe(tags => {
      this.popularTags = tags;
    });

    this.scrollSubscription = this.scrollSubject.pipe(
      throttleTime(200)
    ).subscribe(() => {
      this.loadMoreResults(10);
    });
  }

  onTagClick(tagName: string): void {
    this.searchService.setSearchTerm(tagName);
  }

  loadMoreResults(size: number) {
    if (this.loading || this.noMoreCertificates) {
      return;
    }
    this.errorMessage = '';
    const sortParams = this.sortBy.split(',').map(s => s.trim());
    this.loading = true;
    this.certificateService.searchGiftCertificates(
      this.searchTerm,
      this.page,
      size || this.size,
      sortParams,
      this.minPrice || 0,
      this.maxPrice || 0
    )
      .subscribe((certificates: Certificate[]) => {
          if (certificates === null || certificates === undefined || certificates.length === 0) {
            this.setNoMoreCertificatesMessage();
          } else {
            this.loadCertificatesImages(certificates);
            this.certificates = this.certificates.concat(certificates);
            this.page++;
          }
          this.loading = false;
        },
        (error) => {
          console.log("error: ", error);
          this.loading = false;
        },
      );
  }

  loadCertificatesImages(certificates: Certificate[]) {
    certificates.forEach((certificate: Certificate) => {
      if (certificate.img) {
        this.imageService.getImage(certificate.img).subscribe((data: Blob) => {
          const urlCreator = window.URL || window.webkitURL;
          certificate.certificateImage = urlCreator.createObjectURL(data);
        });
      } else {
        certificate.certificateImage = environment.default_certificate_image;
      }
    });
  }

  setNoMoreCertificatesMessage() {
    if (this.certificates.length > 0) {
      console.log('No more certificates found');
      this.errorMessage = "No more certificates found";
    } else {
      console.log('No certificates found');
      this.errorMessage = "No certificates found";
    }
    this.noMoreCertificates = true;
  }


  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const currentPosition = window.pageYOffset;
    const maxPosition = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (currentPosition >= maxPosition) {
      this.loadMoreResults(10);
    }
  }

  initSearch() {
    console.log("initSearch()");
    this.certificates = [];
    this.page = 0;
    this.allLoaded = false;
    this.noMoreCertificates = false;
    this.loadMoreResults(30);
  }

  addToCart(id: number): void {
    this.cartService.addToCart(id);
  }

  onTileMouseDown(event: Event) {
    const tileElement = (event.target as Element).closest('.certificate-tile');
    if (tileElement) {
      tileElement.classList.add(this.clickedClass);
    }
  }

  onTileMouseUp(event: Event) {
    const tileElement = (event.target as Element).closest('.certificate-tile');
    if (tileElement) {
      tileElement.classList.remove(this.clickedClass);
    }
  }
}
