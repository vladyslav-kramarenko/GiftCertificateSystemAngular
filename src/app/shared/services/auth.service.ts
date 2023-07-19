import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
import {environment} from '../../../environments/environment';
import {User} from '../models/IUser';
import jwt_decode from "jwt-decode";
import {Router} from '@angular/router';
import {PreviousRouteService} from "./previous-route.service";
import {AuthResponse} from "../models/IAuthResponse";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasAccessToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userIdSubject = new BehaviorSubject<number | null>(null);
  userId$ = this.userIdSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private previousRouteService: PreviousRouteService,
  ) {
  }

  loginUser(email: string, password: string) {
    this.logout();
    const url = `${environment.API_URL}/auth/login`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
      .set('email', email)
      .set('password', password);
    return this.http.post<AuthResponse>(url, body.toString(), {headers}).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.isLoggedInSubject.next(true);

        const userId = this.getUserIdFromToken(response.accessToken);
        if (userId !== undefined) {
          this.userIdSubject.next(userId);
          localStorage.setItem('userId', String(userId));
        }
      })
    );
  }

  refreshAccessToken() {
    console.log("refreshAccessToken()");
    localStorage.removeItem('authToken');
    const url = `${environment.API_URL}/auth/refresh-token`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const refreshToken = this.getRefreshToken();

    if (refreshToken === "") {
      console.error('Refresh token is empty');
      this.saveCurrentPage();
      this.logout();
      return throwError('Refresh token is empty');
    }

    const body = new HttpParams().set('refreshToken', refreshToken);

    return this.http.post<AuthResponse>(url, body.toString(), {headers}).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        this.isLoggedInSubject.next(true);

        const userId = this.getUserIdFromToken(response.accessToken);
        if (userId !== undefined) {
          this.userIdSubject.next(userId);
        } else {
          console.log("userId is undefined");
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Token refresh failed, logging out and redirecting to login page');
        this.saveCurrentPage();
        this.logout();
        return throwError(error);
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
    return this.http.post(url, body.toString(), {headers});
  }

  public getAuthToken(): string {
    return localStorage.getItem('authToken') || "";
  }

  public getRefreshToken(): string {
    return localStorage.getItem('refreshToken') || "";
  }

  hasAccessToken(): boolean {
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
    console.log("logout()");
    localStorage.removeItem('authToken');
    this.deleteRefreshTokenFromServer();
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  deleteRefreshTokenFromServer() {
    const refreshToken = this.getRefreshToken();
    if (refreshToken !== "") {
      const url = `${environment.API_URL}/auth/logout`;
      const body = new HttpParams().set('refreshToken', refreshToken);
      this.http.post(url, body.toString());
    } else {
      console.error("refreshToken is empty");
    }
  }

  private getUserIdFromToken(accessToken: string): number | undefined {
    console.log("getUserIdFromToken()");
    const decodedToken: any = jwt_decode(accessToken);
    console.log("decodedToken.roles: " + decodedToken.roles);
    const userAuthority = decodedToken.roles?.find((a: string) => a.startsWith('USER_ID_'));
    return userAuthority ? Number(userAuthority.split('_').pop()) : undefined;
  }


  getUserId(): Observable<number | null> {
    return this.userId$;
  }

  // getUserId(): number {
  //   const token = this.getAuthToken();
  //   if (!token || token === "") {
  //     console.error("authToken is null")
  //     this.refreshAccessToken();
  //   }
  //
  //   try {
  //     const decodedToken: any = jwt_decode(token);
  //     const userAuthority = decodedToken.roles?.find((a: string) => a.startsWith('USER_ID_'));
  //     const userId = Number(userAuthority.split('_').pop());
  //     if (userId != null) return userId
  //     return 0;
  //   } catch (error) {
  //     console.error('Error decoding token', error);
  //     return 0;
  //   }
  // }

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
    return this.http.get<User>(url);
  }

  saveCurrentPage() {
    this.previousRouteService.setPreviousUrl(this.router.url);
  }

}
