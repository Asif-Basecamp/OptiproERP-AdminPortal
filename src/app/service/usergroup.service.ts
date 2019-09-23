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
    UserGroupDesc: model.UserGroupDesc, IsAdminEnabled: model.IsAdminEnabled, SAPUser: model.mapped_user, SAPPass: model.mapped_Password }]) };
 return this.http.post<any>(this.Url,jObject,{ headers: this.header});
}
UpdateUser(model : any){ 
  debugger;
  const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings);  
  this.Url = 'http://localhost:57962/api/UserGroup/UpdateUserGroupRecord';  
 
  var jObject = { UserGroupValues: JSON.stringify([{ UserGroupId: model.UserGroupId,isGrpIdEditable:model.isGrpIdEditable=true,
    UserGroupDesc: model.UserGroupDesc, IsAdminEnabled: model.IsAdminEnabled, SAPUser: model.mapped_user,
    PreviousGrpId:model.PreviousGrpId, SAPPassword: model.mapped_Password }]) };
    return this.http.post<any>(this.Url,jObject,{ headers: this.header});
}
ChkUserGroupAssociativity(model : any)
{
  debugger;
  const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings);  
  this.Url = 'http://localhost:57962/api/UserGroup/ChkUserGroupAssociativity';  
 
  var jObject = { UserGroupValues: JSON.stringify([{ UserGroupId: model.UserGroupId }]) };
    return this.http.post<any>(this.Url,jObject,{ headers: this.header});
}
DeleteUser(model : any){ 
  debugger;
  const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings);  
  this.Url = 'http://localhost:57962/api/UserGroup/DeleteUserGroupRecordById';  
 
  var jObject = { UserGroupValues: JSON.stringify([{ UserGroupId: model.UserGroupId, 
    UserGroupDesc: model.UserGroupDesc, IsAdminEnabled: model.IsAdminEnabled }]) };
    return this.http.post<any>(this.Url,jObject,{ headers: this.header});
}
GetDataByUserId(UserGroupId:string)
{
    const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings);  
    this.Url = 'http://localhost:57962/api/UserGroup/SelectUserGroupRecordById';  
    var jObject = { UserGroupValues: JSON.stringify([{ UserGroupId: UserGroupId }]) };
    return this.http.post<any>(this.Url,jObject,{ headers: this.header});
}
CheckDuplicateUserGroup(UserGrpId:string) {
  
  const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings);  
  this.Url = 'http://localhost:57962/api/UserGroup/CheckUserGroupIdDuplicity';   
  var jObject = { UserGroupValues: JSON.stringify([{ UserGroupId: UserGrpId.toUpperCase() }]) };
 return this.http.post<any>(this.Url,jObject,{ headers: this.header});
  
  }
}
