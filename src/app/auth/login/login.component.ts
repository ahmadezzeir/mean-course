import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {


  isLoading = false;
  private authStatusSubscription: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSubscription = this.authService.getIsUserAuthenticatedSubject()
      .subscribe(authStatus => {
          this.isLoading = false;
      });
  }

  onLogin(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    const user: User = {
      email: form.value.emailInput,
      password: form.value.passwordInput
    }
    this.authService.login(user);
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }

}
