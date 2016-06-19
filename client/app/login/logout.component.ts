import {Component} from '@angular/core';
import {LoginService} from './login.service'
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';


@Component({
  template: '<h1>Good Bye!</h1><br/><a [routerLink]="[\'Login\']" >Login</a>',
  directives: [ROUTER_DIRECTIVES]
})
export class LogoutComponent {

  constructor(private loginService:LoginService) {
    loginService.logout();
  }

}
