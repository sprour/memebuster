import { Injectable } from '@angular/core';
import { Http, Response,Headers, RequestOptions } from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import '../rxjs-operators.js';

@Injectable()
export class LoginService {

  private endpoint:string = 'https://kwhb9xyg8h.execute-api.us-east-1.amazonaws.com/dev';
  //private endpoint:string = 'http://localhost:3001';

  private authToken:string;
  private refreshToken:string;

  public isLoggedIn:boolean=false;

  public currentUser = {
    username: '',
    name: '',
    email: '',
    picture: ''
  }

  constructor(private http: Http) {
    this.loadTokens();
    if(this.refreshToken) {
      this.refreshAuthToken();
    }
  }


  refreshAuthToken() {
    let url = `${this.endpoint}/authentication/refresh/${this.refreshToken}`

    console.log(`Refreshing token ${url}`);
    return this.http.get(url).subscribe(this.onRefreshToken);
  }

  private onRefreshToken = (response:Response) => {
    let body = response.json();
    this.setTokens(body.authorization_token, body.refresh_token);
  }

  public getUserInfo():Observable<Response> {
    let url = this.endpoint + '/authentication/me';
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this.authToken});
    let options = new RequestOptions({ headers: headers });
    console.log(`Getting ${url} with token ${this.authToken}`);
    return this.http.get(url, options).map(this.extractData).catch(this.handleError);
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  private extractData = (res: Response) => {
    let body = res.json();
    console.log("login info: ", body);
    this.currentUser = body;
    return body.data || { };
  }

  private loadTokens() {
    this.authToken = localStorage.getItem('login.authToken');
    this.refreshToken = localStorage.getItem('login.refreshToken');
    if(this.authToken) {this.isLoggedIn = true;}
  }
  private saveTokens() {
    localStorage.setItem('login.authToken', this.authToken);
    localStorage.setItem('login.refreshToken', this.refreshToken);
  }
  private clearTokens() {
    localStorage.removeItem('login.authToken');
    localStorage.removeItem('login.refreshToken');
  }

  setTokens(auth:string, refresh:string) {
    if(auth == this.authToken){
      // Just a page reload or something where the params were sticking around
      return;
    }
    this.authToken = auth;
    this.refreshToken = refresh;
    this.isLoggedIn = true;
    this.saveTokens();
  }

  googleLoginRedirect() {
    this.providerRedirect('google');
  }

  facebookLoginRedirect() {
    this.providerRedirect('facebook');
  }

  logout() {
    this.clearTokens();
    console.log('Logged Out');
  }

  private providerRedirect(provider:string) {
    window.location.href = this.endpoint + '/authentication/signin/' + provider
  }

}

