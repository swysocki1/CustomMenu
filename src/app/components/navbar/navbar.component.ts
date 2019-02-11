import {Component, EventEmitter, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../models/user.model';
import {LoginService} from '../../service/login.service';
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  user: User;
  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.user = this.loginService.getUser();
    this.loginService.getUserUpdates.subscribe(update => {
      this.user = update;
      if (!this.isLogedIn()) {
        this.navigate('/');
      }
    });
  }

  logout() {
    this.loginService.logout();
  }
  isLogedIn() {
    return !!(this.user && this.user.username && this.user.username.trim());
  }
  atSignupPage() {
    return this.router.url === '/signup';
  }
  atSigninPage() {
    return this.router.url === '/login';
  }
  showLinks() {
    return !['/', '/home', '/login', '/signup'].some(path => path === this.router.url);
  }
  navigate(path: string) {
    $('#navbarSupportedContent.show').collapse('hide');
    this.router.navigate([path]);
  }
}
