import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token;
  private isUserAuthenticated = false;
  private isUserAuthenticatedSubject = new Subject<boolean>();

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  getIsUserAuthenticatedSubject(): Observable<boolean> {
    return this.isUserAuthenticatedSubject.asObservable();
  }

  getIsUserAuthenticated(): boolean {
    return this.isUserAuthenticated;
  }

  getToken(): string {
    return this.token;
  }

  createUser(user: User) {

    this.httpClient.post("http://localhost:3000/api/users/signup", user)
    .subscribe(res => {
      // console.log(res);
      this.router.navigate(['/login']);
    })
  }

  login(user: User) {
    this.httpClient.post("http://localhost:3000/api/users/login", user)
    .subscribe((res:any) => {
       console.log('AuthService-login',res);
      this.token = res.token;
      if(this.token) {
        this.isUserAuthenticated = true;
        this.isUserAuthenticatedSubject.next(true);
        this.router.navigate(['/']);
      }
    });
  }

  logout() {
    this.token = null;
    this.isUserAuthenticated = false;
    this.isUserAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }


}
