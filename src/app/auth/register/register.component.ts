import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {FormGroup, FormControl, Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required)
  }, {validators: passwordMatchValidator});

  serverErrorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
  }

  onFormSubmit() {
    if (this.registerForm.valid) {
      const {email, password, firstname, lastname} = this.registerForm.value;
      this.authService.registerUser(email, password, firstname, lastname)
        .subscribe(
          res => {
            console.log("Registered successfully");
            this.serverErrorMessage = '';
            this.router.navigate(['/login']);
          }, err => {
            console.error(err);
            this.serverErrorMessage = err.error?.message || 'An unknown error occurred.';
          }
        );
    }
  }
}

const passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
  const password = control.get('password')?.value;
  const repeatPassword = control.get('repeatPassword')?.value;
  return password !== repeatPassword ? {passwordMismatch: true} : null;
};

