import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';

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

  constructor(private authService: AuthService) {
  }

  ngOnInit() { }

  onFormSubmit() {
    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password).subscribe(res => {
        console.log("Logged in successfully");
        this.serverErrorMessage = '';
      }, err => {
        console.error(err);
        this.serverErrorMessage = err.error.message;
      });
    }
  }
}
