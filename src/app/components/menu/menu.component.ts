import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {LoginService} from '../../service/login.service';
import {ValidationService} from '../../service/validation.service';
import {CartItem, Food, Menu, MenuSection, Restaurant, User} from '../../models/user.model';
import {MenuService} from '../../service/menu.service';
declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  constructor(private route: ActivatedRoute, private ms: MenuService) {}
  restaurant: Restaurant;
  selectedMenu: number;
  cart: CartItem[];
  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.loadMenu(parseInt(params.get('id')));
    });
  }
  loadMenu(id: number) {
    if (this.restaurant && this.restaurant.menus.some(menu => menu.id === id)) {
      this.selectedMenu = id;
    } else {
      this.ms.getRestaurantByMenuId(id).subscribe((restaurant: Restaurant) => {
        // restaurant.menus = restaurant.menus.filter(menu => menu.id === id);
        this.selectedMenu = id;
        restaurant = this.sortMenus(restaurant, true);
        this.restaurant = restaurant;
      });
    }
  }
  sortMenus(restaurant: Restaurant, ascending: boolean) {
    if (restaurant) {
      if (restaurant.menus.length > 0) {
        restaurant.menus = restaurant.menus.sort((a, b) => {
          return this.sort(a.name, b.name, ascending);
        });
        restaurant.menus.forEach((menu: Menu, menuIndex) => {
          if (menu.sections.length > 0) {
            restaurant.menus[menuIndex].sections = menu.sections.sort((a, b) => {
              return this.sort(a.order, b.order, ascending);
            });
            menu.sections.forEach((section: MenuSection, sectionId) => {
              restaurant.menus[menuIndex].sections[sectionId].foods = section.foods.sort((a, b) => {
                return this.sort(a.name, b.name, ascending);
              });
              section.foods.forEach((food: Food, foodIndex) => {
                restaurant.menus[menuIndex].sections[sectionId].foods[foodIndex].addOns = food.addOns.sort((a, b) => {
                  return this.sort(a.name, b.name, ascending);
                });
              });
            });
          }
        });
      }
    }
    return restaurant;
  }
  sort(a, b, ascending: boolean) {
    if (a === null) {
      return 1;
    } else if (b === null) {
      return -1;
    } else if (a === b) {
      return 0;
    } else if (ascending) {
      return a < b ? -1 : 1;
    } else if (!ascending) {
      return a < b ? 1 : -1;
    }
  }
  selectMenuSection(menu, section) {
    //TODO Jump to section
  }
  addCartItem(newItem: Food, qty?: number) {
    if (newItem) {
      if (this.cart.some(cartItem => cartItem.item.id === newItem.id)) {
        this.cart.find(cartItem => cartItem.item.id === newItem.id).qty += qty ? qty : 1;
      } else {
        const newCartItem = new CartItem(newItem);
        this.cart.push(newCartItem);
      }
    }
  }
  removeCartItem(item: Food) {
    if (item && this.cart.some(cartItem => cartItem.item.id === item.id)) {
      if (this.cart.some(cartItem => cartItem.item.id === item.id && cartItem.qty > 1)) {
        this.cart.find(cartItem => cartItem.item.id === item.id).qty -= 1;
      } else {
        this.removeAllCartItem(item);
      }
    }
  }
  removeAllCartItem(item: Food) {
    if (item) {
      if (this.cart.some(cartItem => cartItem.item.id === item.id)) {
        this.cart.splice(this.cart.findIndex(cartItem => cartItem.item.id === item.id), 1);
      }
    }
  }
}
