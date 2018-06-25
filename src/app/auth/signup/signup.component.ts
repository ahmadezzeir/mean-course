import { Subscription } from 'rxjs';

import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {


  isLoading = false;
  private authStatusSubscription: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSubscription = this.authService.getIsUserAuthenticatedSubject()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  onSignup(form:NgForm) {
    if(form.invalid) {
      return;
    }
    const user: User = {
      email: form.value.emailInput,
      password: form.value.passwordInput
    }
    //console.log('com',form.value);
    this.isLoading = true;
    this.authService.createUser(user);
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }

}
