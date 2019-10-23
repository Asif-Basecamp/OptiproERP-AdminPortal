import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';  
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConnectedUsersService {
  Url :string;  
  //token : string;  
  header : any;

  constructor(private http : HttpClient) { 
    this.Url= localStorage.getItem('arrConfigData');
  }

  getProductList(){
      const headerSettings: {[name: string]: string | string[]; } = { 
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings);  
      var a =this.Url;  
      return this.http.get<any>(this.Url+'/api/DefineRole/GetProductList',{ headers: headerSettings});
  }

  getConnectedUserData(ProductName,ControllerName){
    this.Url = 'http://172.16.6.140/'+ProductName+'/api/'+ControllerName+'/getHTTPRuntime';
    const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings); 
    return this.http.get<any>(this.Url,{ headers: this.header});
  }

}
