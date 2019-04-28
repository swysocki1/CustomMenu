import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {LoginService} from '../../service/login.service';
import {ValidationService} from '../../service/validation.service';
import {CartItem, Food, Menu, MenuSection, Restaurant, User} from '../../models/user.model';
import {MenuService} from '../../service/menu.service';
import {DataService} from '../../service/data.service';
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
  ngOnInit() {
    this.user = this.ls.getUser();
    this.loadRestaurants(true);
    this.ls.getUserUpdates.subscribe(user => {
      this.user = user;
      this.loadRestaurants(true);
    });
  }
  loadRestaurants(onlyMyRestaurants: boolean) {
    if (!this.user || !this.user.username) {
      this.router.navigate(['/login']);
    } else {
      this.data.getRestaurants().subscribe((restaurants: Restaurant[]) => {
        if (onlyMyRestaurants) {
          this.restaurants = restaurants.filter(restaurant => restaurant.owners.some(owner => owner.id === this.user.id));
          this.restaurants = this.restaurants.sort((a, b) => {
            return this.sort(a, b, true);
          });
        }
      }, error => {
        console.error(error);
      });
    }
  }

  loadMenu(id: number) {
    this.router.navigate(['/menu/' + id]);
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
}
