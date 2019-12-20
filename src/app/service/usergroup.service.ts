import { Injectable } from '@angular/core';  
import {HttpClient} from '@angular/common/http';  
import {HttpHeaders} from '@angular/common/http';  
import { from, Observable } from 'rxjs';
// import { Login } from './model/login';

@Injectable({
  providedIn: 'root'
})
export class UsergroupService {
  //Url :string;  
  token : string;  
  header : any;
  
  constructor(private http : HttpClient) {
    //this.Url= localStorage.getItem('arrConfigData');
  }
GetUserGroupGridData(model : any)
{
   
  const headerSettings: {[name: string]: string | string[]; } = { 
    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
};  
this.header = new HttpHeaders(headerSettings);  
let url=localStorage.getItem('arrConfigData');
//return this.http.post<any>(this.Url+'UserLogin',model,{ headers: this.header});
return this.http.get<any>(url+'/api/UserGroup/GetAllUserGroupRecords',{ headers: headerSettings});
}
FillDropDownList()
{ 
  const headerSettings: {[name: string]: string | string[]; } = { 
    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
};  
this.header = new HttpHeaders(headerSettings);  
let url=localStorage.getItem('arrConfigData');
//return this.http.post<any>(this.Url+'UserLogin',model,{ headers: this.header});
return this.http.get<any>(url+'/api/UserGroup/GetSAPUser',{ headers: headerSettings});
}

AddUser(model : any){ 
  const headerSettings: {[name: string]: string | string[]; } = {
    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
  };  
    this.header = new HttpHeaders(headerSettings);   
    let url=localStorage.getItem('arrConfigData');
  var jObject = { UserGroupValues: JSON.stringify([{ UserGroupId: model.UserGroupId, 
    UserGroupDesc: model.UserGroupDesc, IsAdminEnabled: model.IsAdminEnabled, SAPUser: model.mapped_user, SAPPass: model.mapped_Password }]) };
 return this.http.post<any>(url+'/api/UserGroup/AddUserGroup',jObject,{ headers: this.header});
}
UpdateUser(model : any){ 
  const headerSettings: {[name: string]: string | string[]; } = {
    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
  };  
    this.header = new HttpHeaders(headerSettings);   
    let url=localStorage.getItem('arrConfigData');
  var jObject = { UserGroupValues: JSON.stringify([{ UserGroupId: model.UserGroupId,isGrpIdEditable:model.isGrpIdEditable=true,
    UserGroupDesc: model.UserGroupDesc, IsAdminEnabled: model.IsAdminEnabled, SAPUser: model.mapped_user,
    PreviousGrpId:model.PreviousGrpId, SAPPassword: model.mapped_Password }]) };
    return this.http.post<any>(url+'/api/UserGroup/UpdateUserGroupRecord',jObject,{ headers: this.header});
}
ChkUserGroupAssociativity(model : any)
{
  
  const headerSettings: {[name: string]: string | string[]; } = {
    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
  };  
    this.header = new HttpHeaders(headerSettings);    
 
  var jObject = { UserGroupValues: JSON.stringify([{ UserGroupId: model.UserGroupId }]) };
  let url=localStorage.getItem('arrConfigData');
    return this.http.post<any>(url+'/api/UserGroup/ChkUserGroupAssociativity',jObject,{ headers: this.header});
}
DeleteUser(model : any){ 
  
  const headerSettings: {[name: string]: string | string[]; } = {
    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
  };  
    this.header = new HttpHeaders(headerSettings);   
 
  var jObject = { UserGroupValues: JSON.stringify([{ UserGroupId: model.UserGroupId, 
    UserGroupDesc: model.UserGroupDesc, IsAdminEnabled: model.IsAdminEnabled }]) };
    let url=localStorage.getItem('arrConfigData');
    return this.http.post<any>(url+'/api/UserGroup/DeleteUserGroupRecordById',jObject,{ headers: this.header});
}
GetDataByUserId(UserGroupId:string)
{
    const headerSettings: {[name: string]: string | string[]; } = {
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);   
    var jObject = { UserGroupValues: JSON.stringify([{ UserGroupId: UserGroupId }]) };
    let url=localStorage.getItem('arrConfigData');
    return this.http.post<any>(url+'/api/UserGroup/SelectUserGroupRecordById',jObject,{ headers: this.header});
}
CheckDuplicateUserGroup(UserGrpId:string) {
  
  const headerSettings: {[name: string]: string | string[]; } = {
    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
  };  
    this.header = new HttpHeaders(headerSettings);   
  var jObject = { UserGroupValues: JSON.stringify([{ UserGroupId: UserGrpId.toUpperCase() }]) };
  let url=localStorage.getItem('arrConfigData');
 return this.http.post<any>(url+'/api/UserGroup/CheckUserGroupIdDuplicity',jObject,{ headers: this.header});
  
  }
}
