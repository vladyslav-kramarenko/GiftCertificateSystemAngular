import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, Observable, Subject, throwError} from 'rxjs';
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

  constructor(private http: HttpClient) {
  }

  getCertificate(id: number): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/certificates/${id}`);
  }

  getCertificates(page: number, size: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<CertificateResponse>(`${environment.API_URL}/certificates`, {params: params}).pipe(
      map(response => {
        return response._embedded.singleGiftCertificateDTOList;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 204) {
      console.log('Certificates not found: ' + error);
      this.errorSubject.next('Certificates not found');
    }
    console.log(error);
    return throwError(error);
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

    return this.http.get<CertificateResponse>(`${environment.API_URL}/certificates/search`, {params: params})
      .pipe(
        map(response => {
          if (response && response._embedded) {
            return response._embedded.singleGiftCertificateDTOList;
          } else {
            // Return an empty array if response or response._embedded is null or undefined
            return [];
          }
        })
      );
  }
}
