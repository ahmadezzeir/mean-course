import { AuthService } from './auth.service';
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next:HttpHandler) {
     // console.log('AuthInterceptor-start');

    const token = this.authService.getToken();
    // console.log('AuthInterceptor-start-token', token);
    const authRequest = req.clone({
      headers: req.headers.set("authorization", "Bearer "+ token),
    });
     // console.log('AuthInterceptor-end-authRequest',authRequest);
    return next.handle(authRequest);
  }
}
