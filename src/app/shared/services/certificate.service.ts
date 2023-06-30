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
    console.log(`Getting certificate with id: ${id}`);
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
    // You can add more logic here if needed
    if (error.status === 204) {
      this.errorSubject.next('Certificates not found');
    }
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
    console.log("entered searchGiftCertificates()");
    console.log("searchTerm = " + searchTerm);
    console.log("pageNo = " + pageNo);
    console.log("pageSize = " + pageSize);
    console.log("sortParams = " + sortParams);
    console.log("minPrice = " + minPrice);
    console.log("maxPrice = " + maxPrice);

    let params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
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
