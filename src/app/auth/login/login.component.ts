import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PreviousRouteService} from "../../shared/services/previous-route.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  serverErrorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private previousRouteService: PreviousRouteService,
  ) {
  }

  ngOnInit() {
  }

  onFormSubmit() {
    if (this.loginForm.valid) {
      this.authService.loginUser(
        this.loginForm.value.email,
        this.loginForm.value.password
      ).subscribe(res => {
        console.log("Logged in successfully");
        const previousUrl = this.previousRouteService.getPreviousUrl();
        this.serverErrorMessage = '';
        if (!previousUrl) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate([previousUrl]);
        }
      }, err => {
        console.error(err);
        if (err.status === 401) {
          this.serverErrorMessage = 'Unauthorized: Invalid email or password.';
        } else {
          this.serverErrorMessage = err.error?.message || 'An unknown error occurred.';
        }
      });
    }
  }
}
