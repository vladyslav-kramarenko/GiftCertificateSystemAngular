import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {FormGroup, FormControl, Validators, ValidatorFn, AbstractControl} from '@angular/forms';

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

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  onFormSubmit() {
    if (this.registerForm.valid) {
      const {email, password, firstname, lastname} = this.registerForm.value;

      // this.authService.registerUser(
      //   this.registerForm.value.email,
      //   this.registerForm.value.password,
      //   this.registerForm.value.firstname,
      //   this.registerForm.value.lastname
      // )
      this.authService.registerUser(email, password, firstname, lastname)
        .subscribe(
          res => {
            console.log("Registered successfully");
            this.serverErrorMessage = '';
          }, err => {
            console.error(err);
            this.serverErrorMessage = err.error?.message || 'An unknown error occurred.';
          }
        );
    }
  }

  passwordsMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const repeatPassword = this.registerForm.get('repeatPassword')?.value;
    return password === repeatPassword;
  }
}

const passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
  const password = control.get('password')?.value;
  const repeatPassword = control.get('repeatPassword')?.value;
  return password !== repeatPassword ? {passwordMismatch: true} : null;
};

