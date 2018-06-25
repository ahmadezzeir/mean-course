import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId: string;
  private token;
  private expiresInDuration = 0;
  // private tokenTimer: any;
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

  getUserId(): string {
    return this.userId;
  }

  saveAuthData(token: string, expiresIn: Date, userId: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expiresIn.toISOString());
    localStorage.setItem('userId', userId);
  }

  getAuthData() : any{
    const token = localStorage.getItem('token');
    const expiresInDate = localStorage.getItem('expiresIn');
    const userId = localStorage.getItem('userId');
    if(!token || !expiresInDate) {
      return;
    }
    return {
      token: token,
      expiresInDate: new Date(expiresInDate),
      userId: userId,
    };
  }

  clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('userId');
  }

  setAuthTimer(duration: number) {
    setTimeout(()=> {
      this.logout();
    }, duration * 1000);
  }

  AutoAuth() {
    const authData = this.getAuthData();
    if(!authData) {
      return;
    }
    const now = new Date();
    const expiresInDuration = authData.expiresInDate.getTime() - now.getTime();
    if(expiresInDuration > 0) {
      this.userId = authData.userId;
      this.token = authData.token;
      this.isUserAuthenticated = true;
      this.isUserAuthenticatedSubject.next(true);
      this.setAuthTimer(expiresInDuration / 1000);

    }
  }

  createUser(user: User) {

    this.httpClient.post("http://localhost:3000/api/users/signup", user)
    .subscribe(res => {
      // console.log(res);
      //this.router.navigate(['/login']);
      this.login(user);
    }, error => {
      this.isUserAuthenticatedSubject.next(false);
    });
  }

  login(user: User) {
    console.log(user);

    this.httpClient.post("http://localhost:3000/api/users/login", user)
    .subscribe((res:any) => {
       //console.log('AuthService-login',res);

      if(res.token) {
        // console.log('there is a token');
        this.userId = res.userId;
        this.token = res.token;
        this.expiresInDuration = res.expiresIn;
        // console.log('AuthService-login-expiresIn',this.expiresIn);
        this.setAuthTimer(this.expiresInDuration);
        this.isUserAuthenticated = true;
        this.isUserAuthenticatedSubject.next(true);
        const now = new Date();
        const expiresInDate = new Date(now.getTime() + (this.expiresInDuration * 1000));
        this.saveAuthData(this.token, expiresInDate,this.userId);
        this.router.navigate(['/']);
      }
    },
    error => {
      this.isUserAuthenticatedSubject.next(false);
    }
    );
  }

  logout() {
    this.userId = null;
    this.token = null;
    this.isUserAuthenticated = false;
    this.isUserAuthenticatedSubject.next(false);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }
}
