import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';
import {MenuComponent} from './components/menu/menu.component';
import {RestaurantComponent} from './components/restaurant/restaurant.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: RestaurantComponent },
  // { path: 'menu/builder/:id', component: MenuBuilderComponent },
  // { path: 'menu/preview/:id', component: CustomMenuComponent },
  { path: 'menu/:id', component: MenuComponent },
  // { path: 'menu/search, component: CustomMenuComponent },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
