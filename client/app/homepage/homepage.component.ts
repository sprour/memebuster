import {Component} from '@angular/core';
import { RouteConfig, RouteParams, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import {LoginService} from "../login/login.service";

@Component({
  templateUrl: 'app/homepage/homepage.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class HomepageComponent {
  constructor(params: RouteParams, public loginService:LoginService){
    if("authorization_token" in params.params) {
      loginService.setTokens(params.params["authorization_token"],
                             params.params["refresh_token"]);
    }
  }

}
