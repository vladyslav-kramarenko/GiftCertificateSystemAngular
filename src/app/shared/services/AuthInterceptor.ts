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

  constructor(
    public authService: AuthService,
    private router: Router,
    private previousRouteService: PreviousRouteService
  ) {
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
        console.log("intercept => route to error page");
        this.router.navigate([`/error/${error.status}`, {errorMessage: error.message}]);
        return throwError(error);
      }
    }));
  }

  private isAuthPage(): boolean {
    const url = this.router.url;
    console.log()
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
      console.log("refreshing = " + this.isRefreshing);
      this.removeAccessToken();
      return this.initiateTokenRefresh(request, next);
    } else {
      console.log("refreshing = " + this.isRefreshing);
      return this.waitForTokenRefresh(request, next);
    }
  }

  private removeAccessToken() {
    try {
      console.log("Removing access token and retrying...");
      localStorage.removeItem('authToken');
      console.log("localStorage.removeItem('authToken')");
      console.log("authToken = " + this.authService.getAuthToken());
    } catch (e) {
      console.log('An error occurred: ', e);
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
          console.log("refreshing = " + this.isRefreshing);
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
    console.log("waitForTokenRefresh()");
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
    this.authService.saveCurrentPageAndLogout();
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
