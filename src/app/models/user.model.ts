export class User {
  id: number;
  photoURL?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  constructor(user?: any) {
    if (user) {
      this.id = user.id;
      this.photoURL = user.photoURL;
      this.username = user.username;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.email = user.email;
      this.photoURL = user.photoURL;
      this.password = user.password;
    }
  }
}

export class Reservation {
  restaurant: string;
  user: string;
  date: Date;
  specialReq: string;
  constructor(reservation?: any) {
    if (reservation) {
      this.restaurant = reservation.restaurant;
      this.user = reservation.user;
      this.date = new Date(reservation.date);
      this.specialReq = reservation.specialReq;
    }
  }
}

export class Restaurant {
  id: number;
  description: string;
  name: string;
  menus: Menu[] = [] as Menu[];
  owners: number[] = [] as number[];
  constructor(restaurant?: any) {
    if (restaurant) {
      this.id = restaurant.id;
      this.name = restaurant.name;
      this.description = restaurant.description;
      this.menus = [];
      if (restaurant.menus && restaurant.menus.length > 0) {
        restaurant.menus.forEach(menu => {
          this.menus.push(new Menu(menu));
        });
      }
      this.owners = restaurant.owners ? restaurant.owners : [];
    }
  }
}

export class Menu {
  id: number;
  restaurant: number;
  name: string;
  description: string;
  sections: MenuSection[] = [] as MenuSection[];
  constructor(menu?: any) {
    this.id = menu.id;
    this.restaurant = menu.restaurant;
    this.name = menu.name;
    this.description = menu.description;
    this.sections = [];
    if (menu.sections && menu.sections.length > 0) {
      menu.sections.forEach(section => {
        this.sections.push(new MenuSection(section));
      });
    }
  }
}

export class MenuSection {
  id: number;
  name: string;
  description: string;
  order: number;
  foods: Food[] = [] as Food[];
  constructor(menuSection?: any) {
    if (menuSection) {
      this.id = menuSection.id;
      this.name = menuSection.name;
      this.description = menuSection.description;
      this.order = menuSection.order;
      this.foods = [];
      if (menuSection.foods && menuSection.foods.length > 0) {
        menuSection.foods.forEach(food => {
          this.foods.push(new Food(food));
        });
      }
    }
  }
}

export class Food {
  id: number;
  name: string;
  description: string;
  imgSrc: string;
  price: number;
  addOns: AddOn[] = [] as AddOn[];
  constructor(food?: any) {
    if (food) {
      this.id = food.id;
      this.name = food.name;
      this.description = food.description;
      this.imgSrc = food.imgSrc;
      this.price = food.price;
      this.addOns = [];
      if (food.addOns && food.addOns.length > 0) {
        food.addOns.forEach(addOn => {
          this.addOns.push(new AddOn(addOn));
        });
      }
    }
  }
}

export class AddOn {
  id: number;
  name: string;
  description: string;
  imgSrc: string;
  price: number;
  constructor(addOn?: any) {
    if (addOn) {
      this.id = addOn.id;
      this.name = addOn.name;
      this.description = addOn.description;
      this.imgSrc = addOn.imgSrc;
      this.price = addOn.price;
    }
  }
}

export class CartItem {
  id: number;
  item: Food;
  qty: number;
  constructor(foodItem: Food) {
    this.item = foodItem;
    this.qty = 1;
  }
}
