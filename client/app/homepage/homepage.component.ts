import {Component} from '@angular/core';
import {RouteConfig, RouteParams, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import {LoginService} from "../login/login.service";
import {Car, CarService} from "../cars/carservice"
import {Response} from '@angular/http';

@Component({
  templateUrl: 'app/homepage/homepage.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [CarService]
})
export class HomepageComponent {

  public loaded:boolean = false;

  public cars:Array<Car> = [];
  public creationCarModel:Car;

  constructor(params: RouteParams,
              public loginService:LoginService,
              private carService:CarService){

    if("authorization_token" in params.params) {
      loginService.setTokens(params.params["authorization_token"],
                             params.params["refresh_token"]);
    }
    if(loginService.isLoggedIn) {
      loginService.refreshAuthToken();
      loginService.getUserInfo().subscribe((response) => {console.log('got user info'); this.loaded=true}, (err) => console.log(err));
    }

    this.createCarStub();
    this.loadCars();
  }

  private createCarStub() {
    this.creationCarModel = {
      make: '',
      year: null,
      mileage: 0
    }
  }

  loadCars() {
    this.carService.loadCars(0).subscribe(this.onCarsLoaded);
  }

  private onCarsLoaded(response:Response) {
    debugger
    console.log(response);
  }


  onCreateEntry() {
    this.cars.push(this.creationCarModel);
    this.carService.createCar(this.creationCarModel).subscribe(this.onCarCreated, this.onCarError)
    this.createCarStub();
  }

  onCarCreated(response:Response) {
    debugger;
  }

  onCarError() {
    debugger;
  }

}
