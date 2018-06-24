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
  private expiresInDuration = 0;
  private tokenTimer: any;
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

  saveAuthData(token: string, expiresIn: Date): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expiresIn.toISOString());
  }

  getAuthData() : any{
    const token = localStorage.getItem('token');
    const expiresInDate = localStorage.getItem('expiresIn');
    if(!token || !expiresInDate) {
      return;
    }
    return {
      token: token, expiresInDate: new Date(expiresInDate)
    };
  }

  clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(()=> {
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
      this.router.navigate(['/login']);
    })
  }

  login(user: User) {
    this.httpClient.post("http://localhost:3000/api/users/login", user)
    .subscribe((res:any) => {
       //console.log('AuthService-login',res);

      if(res.token) {
        // console.log('there is a token');
        this.token = res.token;
        this.expiresInDuration = res.expiresIn;
        // console.log('AuthService-login-expiresIn',this.expiresIn);
        this.setAuthTimer(this.expiresInDuration);
        this.isUserAuthenticated = true;
        this.isUserAuthenticatedSubject.next(true);
        const now = new Date();
        const expiresInDate = new Date(now.getTime() + (this.expiresInDuration * 1000));
        this.saveAuthData(this.token, expiresInDate);
        this.router.navigate(['/']);
      }
    });
  }

  logout() {
    this.token = null;
    this.isUserAuthenticated = false;
    this.isUserAuthenticatedSubject.next(false);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }
}
