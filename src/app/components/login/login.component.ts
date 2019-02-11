import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginService} from '../../service/login.service';
import {ValidationService} from '../../service/validation.service';
import {User} from '../../models/user.model';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [ `
    .jumbotron {
      padding-top: 25vh;
      padding-bottom: 30vh;
    }
  `]
})
export class LoginComponent implements OnInit {
  constructor(private ls: LoginService, private vs: ValidationService, private router: Router, private fb: FormBuilder) {}
  login: FormGroup;
  loginError = '';
  ngOnInit() {
    this.loadLoginForm();
  }
  loadLoginForm() {
    this.login = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onSubmit() {
    this.loginError = '';
    this.ls.login(this.login.value.username, this.login.value.password).subscribe(user => {
      this.loadUserSession(user);
    }, error => {
      this.loadLoginError(error);
    });
  }
  goToCreateNewAccount() {
    this.router.navigate(['/signup']);
  }
  loadUserSession(user: User) {
    this.router.navigate(['/']);
  }
  loadLoginError(message: any) {
    console.error(message);
    this.loginError = message.message;
    // TODO
  }
}
