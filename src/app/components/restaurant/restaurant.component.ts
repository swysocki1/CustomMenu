import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {LoginService} from '../../service/login.service';
import {ValidationService} from '../../service/validation.service';
import {CartItem, Food, Menu, MenuSection, Restaurant, User} from '../../models/user.model';
import {MenuService} from '../../service/menu.service';
import {DataService} from '../../service/data.service';
import {ModalOptions} from '../createNewModal/createNewModal.component';
declare var $: any;

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  constructor(private router: Router, private ls: LoginService, private data: DataService) {}
  restaurants: Restaurant[] = [] as Restaurant[];
  user: User = new User();
  restaurantModalId = 'create-new-restaurant-modal';
  menuModalId = 'create-new-menu-modal';
  onlyMyRestaurants = true;
  restaurant: Restaurant;
  modalOptions: ModalOptions = new ModalOptions();
  ngOnInit() {
    this.modalOptions.requireImg = false;
    this.modalOptions.requirePrice = false;
    this.user = this.ls.getUser();
    this.loadRestaurants(this.onlyMyRestaurants);
    this.ls.getUserUpdates.subscribe(user => {
      this.user = user;
      this.loadRestaurants(this.onlyMyRestaurants);
    });
  }
  loadRestaurants(onlyMyRestaurants: boolean) {
    if (!this.user || !this.user.username) {
      this.router.navigate(['/login']);
    } else if (onlyMyRestaurants) {
      this.data.getRestaurantsByOwner(this.user.id).subscribe((restaurants: Restaurant[]) => {
        this.restaurants = restaurants.sort((a, b) => {
          return this.sort(a, b, true);
        });
      }, error => {
        console.error(error);
      });
    } else {
      this.data.getRestaurants().subscribe((restaurants: Restaurant[]) => {
        this.restaurants = restaurants.sort((a, b) => {
          return this.sort(a, b, true);
        });
      }, error => {
        console.error(error);
      });
    }
  }

  loadMenu(id: number) {
    this.router.navigate(['/menu/' + id]);
  }
  canEditRestaurant(restaurant: Restaurant) {
    console.log(restaurant);
    if (restaurant && restaurant.owners && restaurant.owners.length > 0) {
      return restaurant.owners && restaurant.owners.some(owner => owner.id === this.user.id);
    } else {
      return false;
    }
  }
  loadMenuByRestaurant(restaurant: Restaurant) {
    if (restaurant && restaurant.menus && restaurant.menus.length > 0) {
      this.loadMenu(restaurant.menus[0].id);
    }
  }
  startNewRestaurant() {
    this.restartModal();
    this.modalOptions.title = 'Create New Restaurant';
    $(`#${this.restaurantModalId}`).modal('show');
  }
  createNewRestaurant(r: any) {
    r = new Restaurant(r);
    r.owners.push(this.user.id);
    this.data.createRestaurant(r).subscribe(restaurant => {
      this.loadRestaurants(this.onlyMyRestaurants);
      $(`#${this.restaurantModalId}`).modal('hide');
      this.restartModal();
    });
  }
  editRestaurant(restaurant: Restaurant) {
    this.restartModal();
    this.modalOptions.title = `Modify: ${restaurant.name}`;
    this.restaurant = restaurant;
    $(`#${this.restaurantModalId}`).modal('show');
  }
  updateRestaurant(restaurant: Restaurant) {
    this.data.updateRestaurant(restaurant).subscribe((update: Restaurant) => {
      this.loadRestaurants(true);
      $(`#${this.restaurantModalId}`).modal('hide');
      this.restartModal();
    }, error => {
      console.error(error);
    });
  }
  startNewMenu(restaurant: Restaurant) {
    this.restartModal();
    this.modalOptions.title = 'Create New Menu';
    this.restaurant = restaurant;
    $(`#${this.menuModalId}`).modal('show');
  }
  editMenu(menu: Menu) {
    this.router.navigate(['menu-builder/' + menu.id]);
  }
  createNewMenu(menu: Menu) {
    menu = new Menu(menu);
    menu.restaurant = this.restaurant.id;
    this.data.createMenu(menu).subscribe((res: any) => {
      $(`#${this.menuModalId}`).modal('hide');
      this.restartModal();
      this.loadRestaurants(this.onlyMyRestaurants);
    }, error => {
      console.error(error);
    });
  }
  restartModal() {
    this.restaurant = null;
    this.modalOptions.title = '';
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
}
