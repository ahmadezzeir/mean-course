
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSignup(form:NgForm) {
    if(form.invalid) {
      return;
    }
    const user: User = {
      email: form.value.emailInput,
      password: form.value.passwordInput
    }
    console.log('com',form.value);
    this.authService.createUser(user);
  }

}
