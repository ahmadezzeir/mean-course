import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token;
  private isUserAuthenticatedSubject = new Subject<boolean>();

  constructor(private httpClient: HttpClient) { }

  getIsUserAuthenticatedSubject(): Observable<boolean> {
    return this.isUserAuthenticatedSubject.asObservable();
  }

  createUser(user: User) {

    this.httpClient.post("http://localhost:3000/api/users/signup", user)
    .subscribe(res => {
      console.log(res);
    })
  }

  login(user: User) {
    this.httpClient.post("http://localhost:3000/api/users/login", user)
    .subscribe((res:any) => {
       console.log('AuthService-login',res);
      this.token = res.token;
      this.isUserAuthenticatedSubject.next(true);
      // console.log('AuthService-login-token',  this.token);

    });
  }

  getToken(): string {
    return this.token;
  }
}
