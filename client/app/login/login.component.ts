import {Component} from '@angular/core';
import {LoginService} from './login.service'




@Component({
  selector: 'login-box',
  templateUrl: 'app/login/login.component.html'
})
export class LoginComponent {

  constructor(private loginService:LoginService) {

  }

}
