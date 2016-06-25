
import { Injectable } from '@angular/core';
import { Http, Response,Headers, RequestOptions } from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import '../rxjs-operators.js';
import {LoginService} from "../login/login.service";

export interface  Car {
  make: string,
  year: number,
  mileage: number
}

@Injectable()
export class CarService {

  private endpoint:string = 'https://kwhb9xyg8h.execute-api.us-east-1.amazonaws.com/dev';

  constructor(private http:Http, private loginService:LoginService) {

  }

  createCar(car:Car):Observable<Response> {
    let url = this.endpoint + "/cars";
    return this.http.post(url, car);
  }

  loadCars(page:number):Observable<Response> {
    // TODO: Paged results.
    let url = this.endpoint + "/cars";
    return this.http.get(url);
  }

}
