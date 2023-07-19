import {Injectable} from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError, BehaviorSubject} from 'rxjs';
import {catchError, switchMap, filter, take} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {PreviousRouteService} from './previous-route.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private userId: number | null = null;

  constructor(
    public authService: AuthService,
    private router: Router,
    private previousRouteService: PreviousRouteService
  ) {
    this.authService.userId$.subscribe(userId => {
      this.userId = userId;
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authService.hasAccessToken()) {
      request = this.addToken(request, this.authService.getAuthToken());
    }

    return next.handle(request).pipe(catchError(error => {
      if (this.isAuthPage()) {
        return throwError(error);
      } else if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(request, next);
      } else {
        return throwError(error);
      }
    }));
  }

  private isAuthPage(): boolean {
    const url = this.router.url;
    return url.includes('/login') || url.includes('/register');
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    console.log("handle401Error()");
    if (!this.isRefreshing) {
      this.removeAccessToken();
      return this.initiateTokenRefresh(request, next);
    } else {
      return this.waitForTokenRefresh(request, next);
    }
  }

  private removeAccessToken() {
    try {
      localStorage.removeItem('authToken');
    } catch (e) {
      console.log('An error occurred while removing access token: ', e);
    }
  }

  private initiateTokenRefresh(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("initiateTokenRefresh()");
    this.isRefreshing = true;
    console.log("set refreshing = " + this.isRefreshing);
    this.refreshTokenSubject.next(null);

    const accessToken = this.authService.refreshAccessToken();
    if (accessToken) {
      console.log("access Token is updated");
      return accessToken.pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.accessToken);
          return next.handle(this.addToken(request, token.accessToken));
        }),
        catchError(() => {
          return this.handleRefreshError();
        })
      );
    } else {
      console.log("access Token is null");
      return this.handleRefreshError();
    }
  }

  private waitForTokenRefresh(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(accessToken => {
        return next.handle(this.addToken(request, accessToken));
      })
    );
  }

  private handleRefreshError(): Observable<never> {
    console.log("handleRefreshError()");
    this.authService.saveCurrentPage();
    this.authService.logout();
    this.isRefreshing = false;
    this.refreshTokenSubject.next(null);
    this.navigateToLogin();
    return throwError(new HttpErrorResponse({error: 'Failed to refresh token'}));
  }

  private navigateToLogin() {
    console.log("navigateToLogin()");
    this.previousRouteService.setPreviousUrl(this.router.url);
    this.router.navigate(['/login']);
  }
}
