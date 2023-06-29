import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";

interface CertificateResponse {
  _embedded: {
    singleGiftCertificateDTOList: any[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

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
        // map the '_embedded.singleGiftCertificateDTOList' from the response to an array of certificates
        // return response['_embedded']['singleGiftCertificateDTOList'];
        return response._embedded.singleGiftCertificateDTOList;
      })
    );
  }
}
