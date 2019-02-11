/**
 * Created by swysocki on 5/10/18.
 */

import {EventEmitter, Injectable} from '@angular/core';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user.model';
import {Observable, Subscription} from 'rxjs';

@Injectable()
export class LoginService {
  private _user: User = new User();
  getUserUpdates: EventEmitter<User> = new EventEmitter<User>();
  constructor(private http: HttpClient) { }
  getUser() {
    return this._user;
  }
  updateUser(user: User) {
    this._user = user;
    this.getUserUpdates.emit(user);
  }
  createAccount(user: User, password: string) {
    return new Observable(subscriber => {
      user.id = 'abc123';
      subscriber.next(user);
      subscriber.complete();
    });
  }
  login(username: string, password: string): Observable<User> {
    return new Observable(subscriber => {
      subscriber.next(this.getTestUser());
      subscriber.complete();
    });
  }
  logout() {
    this.updateUser(new User());
  }
  getTestUser(): User {
    const user = new User();
    user.id = 'abc123';
    user.username = 'testUSER';
    user.firstName = 'Sean';
    user.lastName = 'Wysocki';
    user.email = 'swysoc1@students.towson.edu'
    return user;
  }
}
