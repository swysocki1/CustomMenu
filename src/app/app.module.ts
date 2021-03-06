import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LoginService} from './service/login.service';
import {ValidationService} from './service/validation.service';
import {LoginComponent} from './components/login/login.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {SignupComponent} from './components/signup/signup.component';
import {MenuComponent} from './components/menu/menu.component';
import {MenuService} from './service/menu.service';
import {DataService} from './service/data.service';
import {RestaurantComponent} from './components/restaurant/restaurant.component';
import {CreateNewModalComponent} from './components/createNewModal/createNewModal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    NavbarComponent,
    MenuComponent,
    RestaurantComponent,
    CreateNewModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [LoginService, ValidationService, MenuService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
