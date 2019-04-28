/**
 * Created by swysocki on 5/10/18.
 */

import {EventEmitter, Injectable} from '@angular/core';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {AddOn, Food, Menu, MenuSection, Restaurant, User} from '../models/user.model';
import {Observable, Subscription} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable()
export class DataService {
  private _user: User = new User();
  getUserUpdates: EventEmitter<User> = new EventEmitter<User>();
  constructor(private http: HttpClient) { }

  /** USER **/
  authenticate(username: string, password: string) {
    return this.post('/authenticate', {
      username: username,
      password: password
    });
  }
  getUsers() {
    this.get('/user');
  }
  getUser(id: number) {
    return this.get(`/user/${id}`);
  }
  createUser(user: User) {
    return this.post('/user/create', user);
  }
  updateUser(user: User) {
    if (user && user.id) {
      return this.post('/user/update', user);
    } else {
      return this.noIdFoundError();
    }
  }
  deleteUser(user: User) {
    if (user && !user.id) {
      return this.noIdFoundError();
    } else {
      return this.post(`/user/delete`, user);
    }
  }

  /** Restaurant **/
  getRestaurants() {
    return this.get('/restaurant');
  }
  getRestaurantsByOwner(userId: number) {
    return this.get('/restaurant/byOwner/' + userId);
  }
  getRestaurant(id: number) {
    return this.get(`/restaurant/${id}`);
  }
  createRestaurant(restaurant: Restaurant) {
    return this.post('/restaurant/create', restaurant);
  }
  updateRestaurant(restaurant: Restaurant) {
    if (restaurant && restaurant.id) {
      return this.post('/restaurant/update', restaurant);
    } else {
      return this.noIdFoundError();
    }
  }
  deleteRestaurant(restaurant: Restaurant) {
    if (restaurant && !restaurant.id) {
      return this.noIdFoundError();
    } else {
      return this.post(`/restaurant/delete`, restaurant);
    }
  }

  /** MENU **/
  getMenus() {
    this.get('/menu');
  }
  getMenu(id: number) {
    return this.get(`/menu/${id}`);
  }
  createMenu(menu: Menu) {
    return this.post('/menu/create', menu);
  }
  updateMenu(menu: Menu) {
    if (menu && menu.id) {
      return this.post('/menu/update', menu);
    } else {
      return this.noIdFoundError();
    }
  }
  deleteMenu(menu: Menu) {
    if (menu && !menu.id) {
      return this.noIdFoundError();
    } else {
      return this.post(`/menu/delete`, menu);
    }
  }

  /** MENU SECTION **/
  getMenuSections() {
    return this.get('/menu-section');
  }
  getMenuSection(id: number) {
    return this.get(`/menu-section/${id}`);
  }
  createMenuSection(menuSection: MenuSection) {
    return this.post('/menu-section/create', menuSection);
  }
  updateMenuSection(menuSection: MenuSection) {
    if (menuSection && menuSection.id) {
      return this.post('/menu-section/update', menuSection);
    } else {
      return this.noIdFoundError();
    }
  }
  deleteMenuSection(menuSection: MenuSection) {
    if (menuSection && !menuSection.id) {
      return this.noIdFoundError();
    } else {
      return this.post(`/menu-section/delete`, menuSection);
    }
  }

  /** FOOD **/
  getFoods(menuId?: number) {
    return this.get('/food');
  }
  getFood(id: number) {
    return this.get(`/food/${id}`);
  }
  createFood(food: Food) {
    return this.post('/food/create', food);
  }
  updateFood(food: Food) {
    if (food && food.id) {
      return this.post('/food/update', food);
    } else {
      return this.noIdFoundError();
    }
  }
  deleteFood(food: Food) {
    if (food && !food.id) {
      return this.noIdFoundError();
    } else {
      return this.post(`/food/delete`, food);
    }
  }

  /** FOOD **/
  getAddOns(menuId?: number) {
    return this.get('/addOn');
  }
  getAddOn(id: number) {
    return this.get(`/addOn/${id}`);
  }
  createAddOn(addOn: AddOn) {
    return this.post('/addOn/create', addOn);
  }
  updateAddOn(addOn: AddOn) {
    if (addOn && addOn.id) {
      return this.post('/addOn/update', addOn);
    } else {
      return this.noIdFoundError();
    }
  }
  deleteAddOn(addOn: AddOn) {
    if (addOn && !addOn.id) {
      return this.noIdFoundError();
    } else {
      return this.post(`/addOn/delete`, addOn);
    }
  }

  private noIdFoundError() {
    return new Observable(subscriber => {
      subscriber.error('No ID Provided');
      subscriber.complete();
    });
  }
  private get(path: string) {
    return this.http.get(environment.api + path);
  }
  private post(path: string, data: any) {
    return this.http.post(environment.api + path, data);
  }
}
