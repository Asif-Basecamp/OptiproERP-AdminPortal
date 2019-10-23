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
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);  
    var a =this.Url;  
    return this.http.get<any>(this.Url+'/api/Permission/GetUserGroup',{ headers: headerSettings});
  }

  getRoles(){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);  
    var a =this.Url;  
    return this.http.get<any>(this.Url+'/api/Permission/GetRoles',{ headers: headerSettings});
  }

  checkUserCodeExists(UserGroup:string){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);  
    var jObject = { UserGroup: JSON.stringify([{ UserGroup: UserGroup}]) };   
    return this.http.post<any>(this.Url+'/api/Permission/CheckUserCodeExists',jObject,{ headers: headerSettings});
  }

  getUsers(UserGroup:string){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);  
    var jObject = { Users: JSON.stringify([{ UserGroup: UserGroup}]) };     
    return this.http.post<any>(this.Url+'/api/Permission/GetUsers',jObject,{ headers: headerSettings});
  }

  checkUserPermissionForProduct(oModalData:any){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);  
    var jObject = { UserGroup: JSON.stringify(oModalData) };   
    return this.http.post<any>(this.Url+'/api/Permission/CheckUserPermissionForProduct',jObject,{ headers: headerSettings});
  }

  getMenuList(Roles:any[]){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);  
    var jObject = { Roles: JSON.stringify({ OPTM_ADMIN_AUTHR: Roles}) };   
    return this.http.post<any>(this.Url+'/api/Permission/GetMenuList',jObject,{ headers: headerSettings});
  }

  GetDataForUserGroup(UserGroup:string){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);  
    var jObject = { UserGroup: JSON.stringify([{ UserGroup: UserGroup}]) };   
    return this.http.post<any>(this.Url+'/api/Permission/GetDataForUserGroup',jObject,{ headers: headerSettings});
  }

  AddPermission(oSaveModal:any){ 
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);  
    var jObject = { AddPermissionDetails: JSON.stringify(oSaveModal) };   
    return this.http.post<any>(this.Url+'/api/Permission/AddPermission',jObject,{ headers: headerSettings});
  }

  DeletePermission(UserGroup:any){ 
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);  
    var jObject = { DeletePermissionDetails: JSON.stringify([{ UserGroup: UserGroup}]) };   
    return this.http.post<any>(this.Url+'/api/Permission/DeleteAllPermission',jObject,{ headers: headerSettings});
  }
}

