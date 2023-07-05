import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from "rxjs";
import {environment} from '../../../environments/environment';
import {User} from '../models/IUser';
import jwt_decode from "jwt-decode";
import {Router} from '@angular/router';
import {PreviousRouteService} from "./previous-route.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private previousRouteService: PreviousRouteService,
  ) {
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

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  getUserId(): number | null {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log("authToken is null")
      return null;
    }

    try {
      const decodedToken: any = jwt_decode(token);
      const authorities: string[] = decodedToken.roles || [];
      const userAuthority = authorities.find(a => a.startsWith('USER_ID_'));
      if (!userAuthority) {
        console.log("userAuthority is null")
        return null;
      }

      const idString = userAuthority.split('_').pop();
      return Number(idString);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  getUserDetails(id: number): Observable<User> {
    const url = `${environment.API_URL}/users/${id}`;
    const token = localStorage.getItem('authToken');
    console.log("token: " + token);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    console.log(headers);

    // return this.http.get<User>(url, {headers});
    return this.http.get<User>(url, {headers}).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) this.updateStatusToNotAuthorized();
        return throwError(error);
      })
    );
  }

  updateStatusToNotAuthorized() {
    this.logout();
    this.previousRouteService.setPreviousUrl(this.router.url);
    this.router.navigate(['/login']);
  }
}
