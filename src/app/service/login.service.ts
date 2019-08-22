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
    this.Url = 'http://localhost:57962/api/login/AdminLogin/';  
    const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings);  
   }

   Login(model : any){ 
    debugger;  
     var jObject = { LoginDetail: JSON.stringify([{ LoginId: model.UserName, LoginPassword: model.Password }]) } //bug no 14986 Tamanna Feb 
     
     var a =this.Url+'UserLogin';  
   //return this.http.post<any>(this.Url+'UserLogin',model,{ headers: this.header});
   return this.http.post<any>(this.Url,jObject,{ headers: this.header});
}
}
