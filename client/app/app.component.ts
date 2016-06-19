import {Component} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {RouteConfig, RouteParams, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import {LoginService} from "./login/login.service";
import {HomepageComponent} from "./homepage/homepage.component";
import {LogoutComponent} from "./login/logout.component";



@RouteConfig([
  {
    path: '/login',
    name: 'Login',
    component: LoginComponent
  },
  {
    path: '/',
    name: 'Default',
    component: HomepageComponent
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutComponent
  }

])


@Component({
    selector: 'meme-app',
    template: '<router-outlet></router-outlet>',
    providers: [ROUTER_PROVIDERS, LoginService],
    directives: [ROUTER_DIRECTIVES]
})
export class AppComponent {
  public token:string = "";
  constructor(){

  }

}
