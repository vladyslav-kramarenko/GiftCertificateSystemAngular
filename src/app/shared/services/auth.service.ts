import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, of, tap, throwError} from "rxjs";
import {environment} from '../../../environments/environment';
import {User} from '../models/IUser';
import jwt_decode from "jwt-decode";
import {Router} from '@angular/router';
import {PreviousRouteService} from "./previous-route.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

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
        this.isLoggedInSubject.next(true);
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

  hasToken(): boolean {
    console.log("auth service - hasToken()");
    return !!localStorage.getItem('authToken');
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$;
  }

  isManagerOrAdmin(): boolean {
    return this.isManager() || this.isAdmin();
  }

  isManager(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('manager');
  }

  isAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('admin');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isLoggedInSubject.next(false);
  }

  validateToken(): Observable<boolean> {
    console.log("auth service - validateToken()");
    const url = `${environment.API_URL}/validate-token`;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('authToken'));
    return this.http.get(url, {headers})
      .pipe(
        map(() => {
          console.log("Token is valid");
          this.isLoggedInSubject.next(true);
          return true;
        }),
        catchError(() => {
          console.log("Token is invalid");
          this.isLoggedInSubject.next(false);
          return of(false);
        })
      );
  }

  getUserId(): number | null {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log("authToken is null")
      return null;
    }

    try {
      const decodedToken: any = jwt_decode(token);
      const userAuthority = decodedToken.roles?.find((a: string) => a.startsWith('USER_ID_'));
      return userAuthority ? Number(userAuthority.split('_').pop()) : null;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  getUserRoles(): string[] {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return [];
    }

    try {
      const decodedToken: any = jwt_decode(token);
      const authorities: string[] = decodedToken.roles || [];
      const userRoles: string[] = authorities.filter((a: string) => a && !a.startsWith('USER_ID_'));
      return userRoles.map(role => role?.toLowerCase() || '');
    } catch (error) {
      console.error('Error decoding token', error);
      return [];
    }
  }

  getUserDetails(id: number): Observable<User> {
    const url = `${environment.API_URL}/users/${id}`;
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
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
