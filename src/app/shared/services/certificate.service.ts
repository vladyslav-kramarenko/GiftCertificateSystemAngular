import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, Observable, Subject, throwError} from 'rxjs';
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {Certificate} from "../models/ICertificate";
import {CertificateResponse} from "../models/ICertificateResponse";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private errorSubject = new Subject<string>();
  public error$ = this.errorSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  getCertificate(id: number):
    Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/certificates/${id}`);
  }

  updateCertificate(id: number, data: any):
    Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    console.log(`token: ` + token);
    console.log(`id: ${id}`);
    console.log(`certificate:`, data);
    const url = `${environment.API_URL}/certificates/${id}`;
    console.log("url: " + url)
    return this.http.put<any>(url, data, {headers})
      .pipe(
        catchError(this.handleError)
      );
  }

  createCertificate(data: any):
    Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<any>(`${environment.API_URL}/certificates`, data, {headers,observe: 'response'})
      .pipe(
        catchError(this.handleError)
      );
  }

  getCertificates(page: number, size: number):
    Observable<any> {
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

  private handleError = (error: HttpErrorResponse) => {
    console.log("error.status: " + error.status);
    if (error.status === 204) {
      console.log('Certificates not found: ' + error);
      this.errorSubject.next('Certificates not found');
    }
    if (error.status === 401) this.authService.updateStatusToNotAuthorized();

    console.log(error.message);
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
