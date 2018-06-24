import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from '../auth/auth.service';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isUserAuthenticated = false;
  isUserAuthenticatedSubscription: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getIsUserAuthenticated()
    this.isUserAuthenticatedSubscription = this.authService.getIsUserAuthenticatedSubject()
      .subscribe((isUserAuthenticated: boolean) => {
        this.isUserAuthenticated = isUserAuthenticated;
      })
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.isUserAuthenticatedSubscription.unsubscribe();
  }
}


