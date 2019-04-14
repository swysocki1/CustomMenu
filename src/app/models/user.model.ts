export class User {
  id: string;
  photoURL?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class Reservation {
  resturant: string;
  user: string;
  date: string;
  specialReq: string;
}

export class Resturant {
  id: string;
  name: string;
  menus: string[];
  owners: string[];
}

export class Menu {
  id: string;
  name: string;
  description: string;
  sections: MenuSection[];
}

export class MenuSection {
  id: string;
  name: string;
  description: string;
  order: number;
  foods: Food[];
  addOns: AddOn[];
}

export class Food {
  id: string;
  name: string;
  description: string;
  imgSrc: string;
  price: number;
  addOns: AddOn[];
}

export class AddOn {
  id: string;
  name: string;
  description: string;
  imgSrc: string;
  price: number;
}

export class CartItem {
  id: string;
  item: Food;
  qty: number;
  constructor(foodItem: Food) {
    this.item = foodItem;
    this.qty = 1;
  }
}
