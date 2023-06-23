import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email: string="";
  password: string="";

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  onFormSubmit() {
    this.authService.registerUser(this.email, this.password).subscribe(res => {
      // handle response here
    }, err => {
      // handle error here
      console.error(err);
    });
  }
}


