/**
 * Created by swysocki on 5/10/18.
 */

import {EventEmitter, Injectable} from '@angular/core';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {Menu, Resturant, User} from '../models/user.model';
import {Observable, Subscription} from 'rxjs';

@Injectable()
export class MenuService {
  constructor(private http: HttpClient) { }
  getMenuById(id: string): Observable<Menu> {
    // TODO
    return new Observable(subscriber => {
      const menu = this.getTestMenu();
      menu.id = id;
      subscriber.next(menu);
      subscriber.complete();
    });
  }
  getResturantByMenuId(id: string) {
    // TODO
    return new Observable(subscriber => {
      const resturant = this.getTestResturant();
      resturant.menus.push(id);
      subscriber.next(resturant);
      subscriber.complete();
    });
  }
  private getTestMenu() {
    const menu = new Menu();
    menu.id = 'test-id';
    menu.name = 'Resturant Name';
    menu.description = 'Here is a loong  loong loong loong loong loong  loong loong  ô long lo';
    return menu;
  }
  private getTestResturant(): Resturant {
    const resturant = new Resturant();
    resturant.menus = ['testabc', '123idk'];
    resturant.name = 'TEST Resrurant';
    resturant.owners = ['testownder'];
    resturant.id = 'test-resturantid';
    return resturant;
  }
}
