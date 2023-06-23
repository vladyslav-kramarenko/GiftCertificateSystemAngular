import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from "rxjs";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  loginUser(email: string, password: string) {
    const url = `${environment.API_URL}/auth/login`;

    return this.http.post<string>(url, { email, password }, { responseType: 'text' as 'json' }).pipe(
      tap((token: string) => {
        localStorage.setItem('authToken', token);
      })
    );
  }

  registerUser(email: string, password: string) {
    const url = `${environment.API_URL}/auth/register`;
    return this.http.post(url, {email, password});
  }

  getUserDetails() {
    const url = `${environment.API_URL}/user`;
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    return this.http.get(url, {headers});
  }
}
