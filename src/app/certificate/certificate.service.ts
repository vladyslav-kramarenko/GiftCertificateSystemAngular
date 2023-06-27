import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private http: HttpClient) {
  }

  getCertificate(id: number): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/certificates/${id}`);
  }
}
