import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';  
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  Url :string;  
  //token : string;  
  header : any;

  constructor(private http : HttpClient) { 
    this.Url= localStorage.getItem('arrConfigData');
  }

  getPermissionView(){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);  
    var a =this.Url;  
    return this.http.get<any>(this.Url+'/api/Permission/GetPermissionView',{ headers: headerSettings});
  }

  getUserGroup(){
    this.Url = 'http://172.16.6.166:1297/api/Permission/GetUserGroup';  
    const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings); 
    return this.http.get<any>(this.Url,{ headers: this.header});
  }

  getRoles(){
    this.Url = 'http://172.16.6.166:1297/api/Permission/GetRoles';
    const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings); 
    return this.http.get<any>(this.Url,{ headers: this.header});
  }

  checkUserCodeExists(UserGroup:string){
    this.Url = 'http://172.16.6.166:1297/api/Permission/CheckUserCodeExists';
    const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings); 
    var jObject = { UserGroup: JSON.stringify([{ UserGroup: UserGroup}]) };   
    return this.http.post<any>(this.Url,jObject,{ headers: this.header});
  }

  getUsers(UserGroup:string){
    this.Url = 'http://172.16.6.166:1297/api/Permission/GetUsers';
    const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings); 
    var jObject = { Users: JSON.stringify([{ UserGroup: UserGroup}]) };   
    return this.http.post<any>(this.Url,jObject,{ headers: this.header});
  }

  checkUserPermissionForProduct(oModalData:any){
    this.Url = 'http://172.16.6.166:1297/api/Permission/CheckUserPermissionForProduct';
    const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings); 
    var jObject = { UserGroup: JSON.stringify(oModalData) };   
    return this.http.post<any>(this.Url,jObject,{ headers: this.header});
  }

  getMenuList(Roles:any[]){
    this.Url = 'http://172.16.6.166:1297/api/Permission/GetMenuList';
    const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings); 
    var jObject = { Roles: JSON.stringify({ OPTM_ADMIN_AUTHR: Roles}) };   
    return this.http.post<any>(this.Url,jObject,{ headers: this.header});
  }

  GetDataForUserGroup(UserGroup:string){
    this.Url = 'http://172.16.6.166:1297/OptiProERPAdminService/api/Permission/GetDataForUserGroup';
    const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings); 
    var jObject = { UserGroup: JSON.stringify([{ UserGroup: UserGroup}]) };   
    return this.http.post<any>(this.Url,jObject,{ headers: this.header});
  }

  AddPermission(oSaveModal:any){ 
    this.Url = 'http://172.16.6.166:1297/api/Permission/AddPermission';
    const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings); 
    var jObject = { AddPermissionDetails: JSON.stringify(oSaveModal) };   
    return this.http.post<any>(this.Url,jObject,{ headers: this.header});
  }
}

