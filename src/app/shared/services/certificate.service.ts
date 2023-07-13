import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {Certificate} from "../models/ICertificate";
import {CertificateResponse} from "../models/ICertificateResponse";

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private errorSubject = new Subject<string>();
  public error$ = this.errorSubject.asObservable();
  private certificatesEndpoint = `${environment.API_URL}/certificates`;

  constructor(private http: HttpClient) {
  }

  getCertificate(id: number): Observable<any> {
    return this.http.get<Certificate>(`${this.certificatesEndpoint}/${id}`);
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

  searchGiftCertificates(
    searchTerm: string,
    pageNo: number,
    pageSize: number,
    sortParams: String[],
    minPrice: number,
    maxPrice: number
  ): Observable<Certificate[]> {

    let params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('page', pageNo.toString())
      .set('size', pageSize.toString())
      .set('sort', sortParams.join(','))
      .set('minPrice', minPrice)
      .set('maxPrice', maxPrice);

    const url = this.certificatesEndpoint + `/search`;
    return this.http.get<CertificateResponse>(url, {params: params})
      .pipe(
        map(response => {
          if (response && response._embedded) {
            return response._embedded.singleGiftCertificateDTOList;
          } else {
            return [];
          }
        })
      );
  }
}
