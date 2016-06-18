import { Injectable } from '@angular/core';
import { Http, Response,Headers, RequestOptions } from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import '../rxjs-operators.js';

@Injectable()
export class LoginService {

  private endpoint:string = 'https://kwhb9xyg8h.execute-api.us-east-1.amazonaws.com/dev';

  private authToken:string;
  private refreshToken:string;

  public isLoggedIn:boolean=false;

  constructor(private http: Http) {

  }

  // refreshToken() {
  //   // endpoint + '/authentication/refresh/' + localStorage.getItem('refresh_token');
  // }

  getUserInfo() {
    let url = this.endpoint + '/test-token';
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this.authToken});
    let options = new RequestOptions({ headers: headers });
    console.log("Getting " + url);
    return this.http.get(url, options).map(this.extractData).catch(this.handleError).subscribe((a)=>console.log(a););
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  private extractData(res: Response) {
    let body = res.json();
    console.log("login info: " + body);
    return body.data || { };
  }

  setTokens(auth:string, refresh:string) {
    this.authToken = auth;
    this.refreshToken = refresh;
    this.isLoggedIn = true;
    this.getUserInfo();
  }

  googleLoginRedirect() {
    this.providerRedirect('google');
  }

  facebookLoginRedirect() {
    this.providerRedirect('facebook');
  }

  logout() {
    localStorage.removeItem('authorization_token');
    localStorage.removeItem('refresh_token');
  }

  private providerRedirect(provider:string) {
    window.location.href = this.endpoint + '/authentication/signin/' + provider
  }

}

