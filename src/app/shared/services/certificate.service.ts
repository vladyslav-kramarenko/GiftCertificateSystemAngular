import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, concatMap, from, Observable, of, Subject, toArray} from 'rxjs';
import {environment} from "../../../environments/environment";
import {filter, map, switchMap} from "rxjs/operators";
import {Certificate} from "../models/ICertificate";
import {CertificateResponse} from "../models/ICertificateResponse";
import {ImageService} from "./image.service";

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private errorSubject = new Subject<string>();
  public error$ = this.errorSubject.asObservable();
  private certificatesEndpoint = `${environment.API_URL}/certificates`;

  constructor(
    private http: HttpClient,
    private imageService: ImageService,
  ) {
  }

  getCertificate(id: number): Observable<any> {
    return this.http.get<Certificate>(`${this.certificatesEndpoint}/${id}`)
      .pipe(
        switchMap((certificate: Certificate) => {
          return this.loadCertificateImage(certificate);
        }),
        catchError(
          () => {
            console.error("error while trying to find certificate with id = " + id);
            return of();
          }
        )
      );
  }

  loadCertificateImage(certificate: Certificate) {
    if (certificate.img) {
      return this.imageService.getImage(certificate.img).pipe(
        map((data: Blob) => {
          const urlCreator = window.URL || window.webkitURL;
          certificate.certificateImage = urlCreator.createObjectURL(data);
          return certificate;
        }),
        catchError(() => {
          console.error("Error loading image for certificate with id = " + certificate.id);
          certificate.certificateImage = environment.default_certificate_image;
          return of(certificate);
        })
      );
    }
    certificate.certificateImage = environment.default_certificate_image;
    return of(certificate);
  }


  updateCertificate(id: number, certificate: Certificate): Observable<Certificate> {
    return this.http.put<Certificate>(`${this.certificatesEndpoint}/${id}`, certificate);
  }

  createCertificate(certificate: Certificate): Observable<any> {
    return this.http.post<Certificate>(this.certificatesEndpoint, certificate, {observe: 'response'});
  }

  deleteCertificate(id: number): Observable<any> {
    return this.http.delete<void>(`${this.certificatesEndpoint}/${id}`);
  }

  private getSearchParams(
    searchTerm: string,
    pageNo: number,
    pageSize: number,
    sortParams: String[],
    minPrice: number,
    maxPrice: number
  ): HttpParams {
    return new HttpParams()
      .set('searchTerm', searchTerm)
      .set('page', pageNo.toString())
      .set('size', pageSize.toString())
      .set('sort', sortParams.join(','))
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString());
  }

  private handleCertificatesResponse(response: CertificateResponse): Observable<Certificate[]> {
    if (response && response._embedded && Array.isArray(response._embedded.singleGiftCertificateDTOList)) {
      return of(response._embedded.singleGiftCertificateDTOList);
    } else {
      return of([] as Certificate[]);
    }
  }

  private processCertificate(certificate: Certificate): Observable<Certificate | null> {
    return this.loadCertificateImage(certificate)
      .pipe(
        catchError(err => {
          console.error(err);
          return of(null);
        }),
      );
  }

  searchGiftCertificates(
    searchTerm: string,
    pageNo: number,
    pageSize: number,
    sortParams: String[],
    minPrice: number,
    maxPrice: number
  ): Observable<Certificate[]> {

    const params = this.getSearchParams(searchTerm, pageNo, pageSize, sortParams, minPrice, maxPrice);
    const url = this.certificatesEndpoint + `/search`;

    return this.http.get<CertificateResponse>(url, {params: params})
      .pipe(
        switchMap(response => this.handleCertificatesResponse(response)),
        switchMap(certificates => from(certificates)), // Flatten the array into an Observable stream
        concatMap((certificate: Certificate) => this.processCertificate(certificate)),
        filter(certificate => certificate !== null),
        map(certificate => certificate as Certificate),  // Assert non-nullability
        toArray()
      );
  }
}
