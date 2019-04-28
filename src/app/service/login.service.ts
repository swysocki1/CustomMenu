/**
 * Created by swysocki on 5/10/18.
 */

import {EventEmitter, Injectable} from '@angular/core';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user.model';
import {Observable, Subscription} from 'rxjs';
import {DataService} from './data.service';

@Injectable()
export class LoginService {
  private _user: User = new User();
  getUserUpdates: EventEmitter<User> = new EventEmitter<User>();
  constructor(private http: HttpClient, private data: DataService) { }
  getUser() {
    return this._user;
  }
  updateUser(user: User) {
    this._user = user;
    this.getUserUpdates.emit(user);
  }
  createAccount(user: User) {
    return this.data.createUser(user);
  }
  login(username: string, password: string): Observable<User> {
    return new Observable(subscriber => {
      this.data.authenticate(username, password).subscribe(res => {
        subscriber.next(new User(res));
        subscriber.complete();
      }, error => {
        subscriber.error(error);
        subscriber.complete();
      });
    });
  }
  logout() {
    this.updateUser(new User());
  }
}
