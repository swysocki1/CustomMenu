import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {LoginService} from '../../service/login.service';
import {ValidationService} from '../../service/validation.service';
import {AddOn, CartItem, Food, Menu, MenuSection, Restaurant, User} from '../../models/user.model';
import {MenuService} from '../../service/menu.service';
import {ModalOptions} from '../createNewModal/createNewModal.component';
import {DataService} from '../../service/data.service';
declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private ms: MenuService, private ls: LoginService, private data: DataService) {}
  restaurant: Restaurant;
  selectedMenu: number;
  cart: CartItem[];
  editMode = false;
  restaurantModalId = 'create-new-restaurant-modal';
  modalOptions = new ModalOptions();
  editObj: any;
  associatedId: number;
  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.loadMenu(parseInt(params.get('id')));
    });
  }
  loadMenu(id: number) {
    // if (this.restaurant && this.restaurant.menus.some(menu => menu.id === id)) {
    //   this.selectedMenu = id;
    // } else {
      this.ms.getRestaurantByMenuId(id).subscribe((restaurant: Restaurant) => {
        // restaurant.menus = restaurant.menus.filter(menu => menu.id === id);
        this.selectedMenu = id;
        restaurant = this.sortMenus(restaurant, true);
        this.restaurant = restaurant;
      });
    // }
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

  // EDIT MODE
  canEdit() {
    const user = this.ls.getUser();
    if (!this.restaurant || !this.restaurant.id || !this.restaurant.owners || !user || !user.id) {
      return false;
    } else {
      return user && this.restaurant.owners.some(owner => owner.id === user.id);
    }
  }
  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  openModal(title: string, currentClass: string, associantedId: number, editObj?: any) {
    this.modalOptions = new ModalOptions();
    this.modalOptions.title = title;
    this.modalOptions.currentClass = currentClass;
    this.editObj = editObj;
    this.associatedId = associantedId;
    if (currentClass === 'Food') {
      this.modalOptions.requirePrice = true;
      this.modalOptions.requireImg = true;
    } else if (currentClass === 'AddOn') {
      this.modalOptions.requirePrice = true;
    }
    $(`#${this.restaurantModalId}`).modal('show');
  }
  resetModal() {
    $(`#${this.restaurantModalId}`).modal('hide');
    this.modalOptions = new ModalOptions();
    this.editObj = null;
    this.associatedId = null;
  }
  startNewRestaurant(restaurant: Restaurant) {
    this.openModal(restaurant ? `Updating Restaurant : ${restaurant.name}` : 'Create New Restaurant', 'Restaurant', null, restaurant);
  }
  startNewMenu(restaurant: Restaurant, menu?: Menu) {
    this.openModal(menu ? `Updating Menu : ${menu.name}` : 'Create New Menu', 'Menu', restaurant.id, menu);
  }
  startNewMenuSection(menu: Menu, section?: MenuSection) {
    this.openModal(section ? `Updating Menu Section : ${section.name}` : 'Create New Menu Section', 'MenuSection', menu.id, section);
  }
  startNewFood(section: MenuSection, food?: Food) {
    this.openModal(food ? `Updating Food : ${food.name}` : 'Create New Food', 'Food', section.id, food);
  }
  startNewFoodAddon(food: Food, addon?: AddOn) {
    this.openModal(addon ? `Updating Add On: ${addon.name}` : 'Create New Add On', 'AddOn', food.id, addon);
  }
  updateObj(obj: any) {
    switch (this.modalOptions.currentClass) {
      case 'Restaurant': this.updateRestaurant(obj); break;
      case 'Menu': this.updateMenu(obj); break;
      case 'MenuSection': this.updateMenuSection(obj); break;
      case 'Food': this.updateFood(obj); break;
      case 'AddOn': this.updateAddOn(obj); break;
    }
  }
  updateRestaurant(restaurant: any) {
    if (restaurant) {
      this.restaurant.name = restaurant.name;
      this.restaurant.description = restaurant.description;
      if (restaurant.id) {
        this.data.updateRestaurant(restaurant).subscribe((res: any) => {
          this.resetModal();
        }, error => {
          console.error(error);
        });
      } else {
        this.resetModal();
      }
    } else {
      this.resetModal();
    }
  }
  updateMenu(menu: any) {
    if (menu) {
      menu = new Menu(menu);
      menu.restaurant = this.associatedId;
      if (menu.id) {
        this.data.updateMenu(menu).subscribe((res: any) => {
          const index = this.restaurant.menus.findIndex(m => m.id === menu.id);
          this.restaurant.menus[index] = new Menu(res);
          this.loadMenu(res.id);
          this.resetModal();
        }, error => {
          console.error(error);
        });
      } else {
        this.data.createMenu(menu).subscribe((res: any) => {
          this.restaurant.menus.push(new Menu(res));
          this.loadMenu(res.id);
          this.resetModal();
        }, error => {
          console.error(error);
        });
      }
    } else {
      this.resetModal();
    }
  }
  updateMenuSection(section: any) {
    if (section) {
      section = new MenuSection(section);
      section.menu = this.associatedId;
      if (section.id) {
        this.data.updateMenuSection(section).subscribe((res: any) => {
          this.restaurant.menus.forEach((menu, m) => {
            menu.sections.forEach((ms, s) => {
              if (ms.id === section.id) {
                this.restaurant.menus[m].sections[s] = new MenuSection(res);
              }
            });
          });
          this.loadMenu(this.selectedMenu);
          this.resetModal();
        }, error => {
          console.error(error);
        });
      } else {
        this.data.createMenuSection(section).subscribe((res: any) => {
          this.restaurant.menus.forEach((menu, m) => {
            menu.sections.forEach((ms, s) => {
              if (ms.id === section.id) {
                this.restaurant.menus[m].sections[s] = new MenuSection(res);
              }
            });
          });
          this.loadMenu(this.selectedMenu);
          this.resetModal();
        }, error => {
          console.error(error);
        });
      }
    } else {
      this.resetModal();
    }
  }
  updateFood(food: any) {
    if (food) {
      food = new Food(food);
      food.section = this.associatedId;
      if (food.id) {
        this.data.updateFood(food).subscribe((res: any) => {
          this.restaurant.menus.forEach((menu, m) => {
            menu.sections.forEach((section, s) => {
              section.foods.forEach((fo, f) => {
                if (fo.id === food.id) {
                  this.restaurant.menus[m].sections[s].foods[f] = new Food(res);
                }
              });
            });
          });
          this.loadMenu(this.selectedMenu);
          this.resetModal();
        }, error => {
          console.error(error);
        });
      } else {
        this.data.createFood(food).subscribe((res: any) => {
          this.restaurant.menus.forEach((menu, m) => {
            menu.sections.forEach((section, s) => {
              section.foods.forEach((fo, f) => {
                if (fo.id === food.id) {
                  this.restaurant.menus[m].sections[s].foods[f] = new Food(res);
                }
              });
            });
          });
          this.loadMenu(this.selectedMenu);
          this.resetModal();
        }, error => {
          console.error(error);
        });
      }
    } else {
      this.resetModal();
    }
  }
  updateAddOn(addon: any) {
    if (addon) {
      addon = new AddOn(addon);
      addon.food = this.associatedId;
      if (addon.id) {
        this.data.updateAddOn(addon).subscribe((res: any) => {
          this.restaurant.menus.forEach((menu, m) => {
            menu.sections.forEach((section, s) => {
              section.foods.forEach((food, f) => {
                food.addOns.forEach((addOn, ao) => {
                  if (addOn.id === addon.id) {
                    this.restaurant.menus[m].sections[s].foods[f].addOns[ao] = new AddOn(res);
                  }
                });
              });
            });
          });
          this.loadMenu(this.selectedMenu);
          this.resetModal();
        }, error => {
          console.error(error);
        });
      } else {
        this.data.createAddOn(addon).subscribe((res: any) => {
          this.restaurant.menus.forEach((menu, m) => {
            menu.sections.forEach((section, s) => {
              section.foods.forEach((food, f) => {
                food.addOns.forEach((addOn, ao) => {
                  if (addOn.id === addon.id) {
                    this.restaurant.menus[m].sections[s].foods[f].addOns[ao] = new AddOn(res);
                  }
                });
              });
            });
          });
          this.loadMenu(this.selectedMenu);
          this.resetModal();
        }, error => {
          console.error(error);
        });
      }
    } else {
      this.resetModal();
    }
  }
  deleteResetaurant() {
    this.data.deleteRestaurant(this.restaurant).subscribe(res => {
      this.router.navigate(['/home']);
    }, error => {
      console.error(error);
    });
  }
  deleteMenu() {
    const menu = this.restaurant.menus.find(m => m.id === this.selectedMenu);
    this.data.deleteMenu(menu).subscribe(res => {
      this.restaurant.menus.splice(this.restaurant.menus.findIndex(m => m.id === this.selectedMenu), 1);
      if (this.restaurant.menus.length < 1) {
        this.selectedMenu = null;
      } else {
        this.loadMenu(this.restaurant.menus[0].id);
      }
    }, error => {
      console.error(error);
    });
  }
  deleteMenuSection(section) {
    this.data.deleteMenuSection(section).subscribe(res => {
      this.loadMenu(this.selectedMenu);
    }, error => {
      console.error(error);
    });
  }
  deleteFood(food) {
    this.data.deleteFood(food).subscribe(res => {
      this.loadMenu(this.selectedMenu);
    }, error => {
      console.error(error);
    });
  }
  deleteAddon(addon) {
    this.data.deleteAddOn(addon).subscribe(res => {
      this.loadMenu(this.selectedMenu);
    }, error => {
      console.error(error);
    });
  }
}
