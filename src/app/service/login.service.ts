import { Injectable } from '@angular/core';  
import {HttpClient} from '@angular/common/http';  
import {HttpHeaders} from '@angular/common/http';  
import { from, Observable } from 'rxjs';
// import { Login } from './model/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  Url :string;  
  token : string;  
  header : any;
  constructor(private http : HttpClient) {
    //this.Url= localStorage.getItem('arrConfigData');
   }

   Login(model : any){ 
    const headerSettings: {[name: string]: string | string[]; } = {
        'Content-Type':'application/json',  
    };  
     
    this.header = new HttpHeaders(headerSettings);
     var jObject = { LoginDetail: JSON.stringify([{ LoginId: model.UserName, LoginPassword: model.Password }]) } //bug no 14986 Tamanna Feb 
      
    let url=localStorage.getItem('arrConfigData');
   //return this.http.post<any>(this.Url+'UserLogin',model,{ headers: this.header}); 
   return this.http.post<any>(url+'/api/login/AdminLogin/',jObject,{ headers: this.header});
   
}
AdminLoginLog(model : any)
{
  var today = new Date();
  var date = today.toLocaleString();
      const headerSettings: {[name: string]: string | string[]; } = {};  
      this.header = new HttpHeaders(headerSettings); 
      var jObject = { LoginDetail: JSON.stringify([{"adminUser":model.UserName,"adminLogDateTime": date }])}
      let url=localStorage.getItem('arrConfigData');
      return this.http.post<any>(url+'/api/login/AdminLoginLog',jObject,{ headers: this.header});
}
}
