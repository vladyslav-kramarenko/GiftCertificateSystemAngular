import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
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
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
      .set('email', email)
      .set('password', password);
    return this.http.post<string>(url, body.toString(), {headers, responseType: 'text' as 'json'}).pipe(
      tap((token: string) => {
        console.log("Obtain a token:" + token);
        localStorage.setItem('authToken', token);
      })
    );
  }

  registerUser(email: string, password: string, firstName: string, lastName: string) {
    console.log("email=" + email);
    console.log("password=" + password);
    console.log("first-name=" + firstName);
    console.log("last-name=" + lastName);
    console.log("email=" + email);
    const url = `${environment.API_URL}/auth/register`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
      .set('email', email)
      .set('password', password)
      .set('firstName', firstName)
      .set('lastName', lastName);
    return this.http.post(url, body.toString(), {headers}).pipe(
      tap((response) => {
        console.log("Obtain a response:" + response);
      })
    );
  }

  getUserDetails() {
    const url = `${environment.API_URL}/user`;
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    return this.http.get(url, {headers});
  }
}
