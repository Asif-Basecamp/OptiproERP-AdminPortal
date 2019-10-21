import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';  
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConnectedusersService {
  Url :string;  
  //token : string;  
  header : any;

  constructor(private http : HttpClient) { }

  getProductList(){
      this.Url = 'http://172.16.6.140/OptiAdmin/api/DefineRole/GetProductList';  
      const headerSettings: {[name: string]: string | string[]; } = {};  
      this.header = new HttpHeaders(headerSettings); 
      return this.http.get<any>(this.Url,{ headers: this.header});
  }

  getConnectedUserData(ProductName,ControllerName){
    this.Url = 'http://172.16.6.140/'+ProductName+'/api/'+ControllerName+'/getHTTPRuntime';
    const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings); 
    return this.http.get<any>(this.Url,{ headers: this.header});
  }

}
