import { Injectable } from '@angular/core';  
import {HttpClient} from '@angular/common/http';  
import {HttpHeaders} from '@angular/common/http';  
import { from, Observable } from 'rxjs';
// import { Login } from './model/login';

@Injectable({
  providedIn: 'root'
})
export class UsergroupService {
  Url :string;  
  token : string;  
  header : any;
  
  constructor(private http : HttpClient) {
    
  }
GetUserGroupGridData(model : any)
{
  debugger
  this.Url = 'http://localhost:57962/api/UserGroup/GetAllUserGroupRecords';  
  const headerSettings: {[name: string]: string | string[]; } = {};  
  this.header = new HttpHeaders(headerSettings);  
  var a =this.Url;  
 //return this.http.post<any>(this.Url+'UserLogin',model,{ headers: this.header});
 return this.http.get<any>(this.Url,{ headers: this.header});
}
FillDropDownList()
{
  this.Url = 'http://localhost:57962/api/UserGroup/GetSAPUser';  
  const headerSettings: {[name: string]: string | string[]; } = {};  
  this.header = new HttpHeaders(headerSettings); 
 return this.http.get<any>(this.Url,{ headers: this.header});
}

AddUser(model : any){ 
  debugger;
  const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings);  
  this.Url = 'http://localhost:57962/api/UserGroup/AddUserGroup';  
 
  var jObject = { UserGroupValues: JSON.stringify([{ UserGroupId: model.UserGroupId, 
    UserGroupDesc: model.UserGroupDesc, IsAdminEnabled: model.IsAdminEnabled, SAPUser: model.mapped_user.USER_CODE, SAPPass: model.mapped_Password }]) };
 return this.http.post<any>(this.Url,jObject,{ headers: this.header});
}
CheckDuplicateUserGroup(UserGrpId:string) {
  debugger;
  const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings);  
  this.Url = 'http://localhost:57962/api/UserGroup/CheckUserGroupIdDuplicity';   
  var jObject = { UserGroupValues: JSON.stringify([{ UserGroupId: UserGrpId.toUpperCase() }]) };
 return this.http.post<any>(this.Url,jObject,{ headers: this.header});
  
}
}
