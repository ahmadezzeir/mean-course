import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient:HttpClient) { }
  private token;
  createUser(user: User) {

    this.httpClient.post("http://localhost:3000/api/users/signup", user)
    .subscribe(res => {
      console.log(res);
    })
  }

  login(user: User) {
    this.httpClient.post("http://localhost:3000/api/users/login", user)
    .subscribe(res => {
      // console.log('AuthService-login',res);
      this.token = res.token;
      // console.log('AuthService-login-token',  this.token);

    });
  }

  getToken(): string {
    return this.token;
  }
}
