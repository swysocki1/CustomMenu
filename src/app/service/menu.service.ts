/**
 * Created by swysocki on 5/10/18.
 */

import {EventEmitter, Injectable} from '@angular/core';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {Menu, Restaurant, User} from '../models/user.model';
import {Observable, Subscription} from 'rxjs';
import {DataService} from './data.service';

@Injectable()
export class MenuService {
  constructor(private http: HttpClient, private data: DataService) { }
  getMenu(id: number) {
    return this.data.getMenu(id);
  }
  getRestaurantByMenuId(id: number): Observable<Restaurant> {
    return new Observable(subscriber => {
      this.data.getMenu(id).subscribe((menu: Menu) => {
        if (menu && menu.restaurant) {
          this.data.getRestaurant(menu.restaurant).subscribe((restaurant: Restaurant) => {
            subscriber.next(restaurant);
            subscriber.complete();
          });
        } else {
          subscriber.error('Menu Restaurant Could Not Be Found');
          subscriber.complete();
        }
      }, error => {
        subscriber.error(error);
        subscriber.complete();
      });
    });
  }
}
