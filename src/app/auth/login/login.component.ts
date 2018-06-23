import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    if(form.invalid) {
      return;
    }
    const user: User = {
      email: form.value.emailInput,
      password: form.value.passwordInput
    }
    console.log('com',form.value);
    this.authService.login(user);
  }

}
