import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';  
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConnectedUsersService {
  Url :string;     
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
    let URL = this.Url.replace("OptiProERPAdminService", ProductName);
   
    const headerSettings: {[name: string]: string | string[]; } = {
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings); 
    return this.http.get<any>(URL+'/api/'+ControllerName+'/getHTTPRuntime',{ headers: headerSettings});    
  }

  
  RemoveLoggedInUser(ProductName,ControllerName,GUID,Login){   
    let URL = this.Url.replace("OptiProERPAdminService", ProductName);    
    let jObject:any={ ItemList: JSON.stringify([{ GUID: GUID, Login: Login}]) };    
    const headerSettings: {[name: string]: string | string[]; } = {
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings); 
    if(ProductName == 'CVP'){
      return this.http.post<any>(URL+'/api/'+ControllerName+'/loginuser',jObject,{ headers: headerSettings});
    }
    else{
      return this.http.post<any>(URL+'/api/'+ControllerName+'/RemoveLoggedInUser',jObject,{ headers: headerSettings});

    }    
  }

}
