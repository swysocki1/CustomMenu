import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {LoginService} from '../../service/login.service';
import {ValidationService} from '../../service/validation.service';
import {CartItem, Food, Menu, Resturant, User} from '../../models/user.model';
import {MenuService} from '../../service/menu.service';
declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  constructor(private route: ActivatedRoute, private ms: MenuService) {}
  resturant: Resturant;
  menu: Menu;
  cart: CartItem[];
  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.loadMenu(params.get('id'));
    });
  }
  loadMenu(id: string) {
    this.ms.getMenuById(id).subscribe((menu: Menu) => {
      this.menu = menu;
      this.ms.getResturantByMenuId(id).subscribe((restaurant: Resturant) => {
        this.resturant = restaurant;
      });
    });
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
