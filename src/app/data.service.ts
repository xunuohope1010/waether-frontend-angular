import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // private REST_API_SERVER = 'http://localhost:8081';

  private REST_API_SERVER = 'http://csci571-nodejs.gf7uinr3aq.us-west-1.elasticbeanstalk.com';

  constructor(public httpClient: HttpClient) {
  }

  public sendGetRequest(param: string) {
    let url = this.REST_API_SERVER;
    url += '/weatherSearch?keywords=' + param;
    return this.httpClient.get(url);
  }

  public sendSearchRequest(param: any) {
    let url = this.REST_API_SERVER;
    url += '/weatherSearch?street=' + param.street + '&city=' + param.city + '&state=' + param.state;
    return this.httpClient.get(url);
  }

  public sendTimeRequest(param: any) {
    let url = this.REST_API_SERVER;
    url += '/weatherSearch?time=' + param.time + '&lat=' + param.lat + '&lng=' + param.lng;
    return this.httpClient.get(url);
  }

  public sendIP() {
    return this.httpClient.get('http://ip-api.com/json');
  }

  public sendLocation(param: any) {
    let url = this.REST_API_SERVER;
    url += ('/weatherSearch?latitude=' + param.lat + '&longitude=' + param.lng + '&region=' + param.state);
    return this.httpClient.get(url);
  }

  public test() {
    console.log('test');
  }
}
