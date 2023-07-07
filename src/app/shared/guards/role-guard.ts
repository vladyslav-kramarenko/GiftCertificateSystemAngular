import {AuthService} from "../services/auth.service";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    console.log("RoleGuard - canActivate()");
    return this.authService.isLoggedIn()
      .pipe(
        map(isLoggedIn => {
          if (!isLoggedIn) {
            console.log("user is not Logged in");
            return false;
          } else {
            const expectedRoles = route.data['roles'];
            if (!expectedRoles) {
              console.log("expectedRoles is null");
              return false;
            }

            const userRoles = this.authService.getUserRoles();
            if (!userRoles) {
              console.log("userRoles is null");
              return false;
            }

            const hasRole = expectedRoles.some((role: string) => userRoles.includes(role));
            console.log("Has some of expected Roles: ", hasRole);
            return hasRole;
          }
        })
      );
  }
}
