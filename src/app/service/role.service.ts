import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';  
import {HttpHeaders} from '@angular/common/http';  
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  Url :string;  
  token : string;  
  header : any;
  constructor(private http : HttpClient) {
    this.Url= localStorage.getItem('arrConfigData');
   }

  FillProductDropDownList()
    { 
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings); 
    return this.http.get<any>(this.Url+'/api/DefineRole/GetProductList',{ headers: this.header});
    }

  FillGridData() {
    const headerSettings: { [name: string]: string | string[]; } = {
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };
    this.header = new HttpHeaders(headerSettings);
    return this.http.get<any>(this.Url + '/api/DefineRole/GetAllDefineRoles', { headers: this.header });
  }
   
  FillFridOnDropdownSelectedIndexChanged(ProductName: string) {
    const headerSettings: { [name: string]: string | string[]; } = {
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };
    this.header = new HttpHeaders(headerSettings);
    var jObject = { RoleDetails: JSON.stringify([{ Product: ProductName }]) };

    return this.http.post<any>(this.Url + '/api/DefineRole/GetOperationalMenuList', jObject, { headers: this.header });
  }

  AddUserRole(model: any, SelectedRowData: string[] = []) {
    //this.gridData1=data;
    var oRoleIdDesc = []
    oRoleIdDesc.push({
      RoleId: model.RoleId,
      RoleDesc: model.RoleDesc
    });
    var jObject = { RoleDetails: JSON.stringify({ SelectedRows: SelectedRowData, RoleIdDesc: oRoleIdDesc }) };

    const headerSettings: { [name: string]: string | string[]; } = {
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };
    this.header = new HttpHeaders(headerSettings);
    return this.http.post<any>(this.Url + '/api/DefineRole/OnAddPress', jObject, { headers: this.header });
  }

  UpdateUserRole(model: any, SelectedRowData: string[] = []) {
    var oRoleIdDesc = []
    oRoleIdDesc.push({

      PreviousRoleId: model.PriviousRoleId,
      RoleId: model.RoleId,
      RoleDesc: model.RoleDesc
    });
    var jObject = { RoleDetails: JSON.stringify({ SelectedRows: SelectedRowData, RoleIdDesc: oRoleIdDesc }) };
       
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings); 
      return this.http.post<any>(this.Url+'/api/DefineRole/OnUpdatePress',jObject,{ headers: this.header});
    }
    DeleteUserRole(model : any)
    {
      var jObject = { RoleDetails: JSON.stringify([{ PreviousRoleId: model.RoleId }]) };    
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings); 
      return this.http.post<any>(this.Url+'/api/DefineRole/OnDeletePress',jObject,{ headers: this.header});
    }
    CheckDuplicateUserGroup(RoleId :string)
    {
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings);     
        var jObject = { RoleDetails: JSON.stringify([{ RoleId:RoleId.toUpperCase() }]) };
       return this.http.post<any>(this.Url+'/api/DefineRole/CheckDuplicateRecord',jObject,{ headers: this.header});
    }

  GetDataByRoleId(RoleId: string) {
    const headerSettings: { [name: string]: string | string[]; } = {
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };
    this.header = new HttpHeaders(headerSettings);
    var jObject = { RoleDetails: JSON.stringify([{ RoleId: RoleId }]) };
    return this.http.post<any>(this.Url + '/api/DefineRole/GetDefineRolesByRoleId', jObject, { headers: this.header });
  }

  chkIfGroupIdisAssociate(RoleId: string) {
    const headerSettings: { [name: string]: string | string[]; } = {
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };
    this.header = new HttpHeaders(headerSettings);
    var jObject = { RoleDetails: JSON.stringify([{ RoleId: RoleId }]) };
    return this.http.post<any>(this.Url + '/api/DefineRole/ReferalCheck', jObject, { headers: this.header });
  }

    
}
