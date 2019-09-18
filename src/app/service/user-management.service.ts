import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';  
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  Url :string;  
  token : string;  
  header : any;
  constructor(private http : HttpClient) { }

FillCompNGrpNSAPUsrNProd()
    {
      this.Url = 'http://localhost:57962/api/UserManagement/GetCompNGrpNSAPUsrNProd';  
      const headerSettings: {[name: string]: string | string[]; } = {};  
      this.header = new HttpHeaders(headerSettings); 
      return this.http.get<any>(this.Url,{ headers: this.header});
    }
FillDDlEmployee(selDataBase:string)
    {
      this.Url = 'http://localhost:57962/api/UserManagement/GetEmployee';  
      const headerSettings: {[name: string]: string | string[]; } = {};  
      this.header = new HttpHeaders(headerSettings); 
      var jObject = { CompanyName: JSON.stringify([{ CompanyDBId: selDataBase }]) };
      return this.http.post<any>(this.Url,jObject,{ headers: this.header})
    }
FillGridData()
    {
      this.Url = 'http://localhost:57962/api/UserManagement/UserDetail';  
      const headerSettings: {[name: string]: string | string[]; } = {};  
      this.header = new HttpHeaders(headerSettings); 
      return this.http.get<any>(this.Url,{ headers: this.header});
    }
   
    FillFridOnDropdownSelectedIndexChanged(model : any)
    {
      
      this.Url = 'http://localhost:57962/api/DefineRole/GetOperationalMenuList';  
      const headerSettings: {[name: string]: string | string[]; } = {};  
      this.header = new HttpHeaders(headerSettings); 
      var jObject = { RoleDetails: JSON.stringify([{ Product: model.Product}]) };
       
    return this.http.post<any>(this.Url,jObject,{ headers: this.header});
    }
    AddUserRole(model : any,SelectedRowData :string[]=[])
    {
         
             //this.gridData1=data;
      var oRoleIdDesc = []
                    oRoleIdDesc.push({
                        RoleId: model.RoleId,
                        RoleDesc:model.RoleDesc
                    });
                    var jObject = { RoleDetails: JSON.stringify({ SelectedRows: SelectedRowData, RoleIdDesc: oRoleIdDesc }) };
                    
      this.Url = 'http://localhost:57962/api/DefineRole/OnAddPress';  
      const headerSettings: {[name: string]: string | string[]; } = {};  
      this.header = new HttpHeaders(headerSettings); 
      return this.http.post<any>(this.Url,jObject,{ headers: this.header});
    }

    UpdateUserRole(model : any,SelectedRowData :string[]=[])
    {
      var oRoleIdDesc = []
                    oRoleIdDesc.push({
                      
                      PreviousRoleId:model.PriviousRoleId,
                        RoleId: model.RoleId,
                        RoleDesc:model.RoleDesc
                    });
                    var jObject = { RoleDetails: JSON.stringify({ SelectedRows: SelectedRowData, RoleIdDesc: oRoleIdDesc }) };
      //this.Url = '';                
      this.Url = 'http://localhost:57962/api/DefineRole/OnUpdatePress';  
      const headerSettings: {[name: string]: string | string[]; } = {};  
      this.header = new HttpHeaders(headerSettings); 
      return this.http.post<any>(this.Url,jObject,{ headers: this.header});
    }
    DeleteUserRole(model : any)
    {
      var jObject = { RoleDetails: JSON.stringify([{ PreviousRoleId: model.RoleId }]) };        
      this.Url = 'http://localhost:57962/api/DefineRole/OnDeletePress';  
      const headerSettings: {[name: string]: string | string[]; } = {};  
      this.header = new HttpHeaders(headerSettings); 
      return this.http.post<any>(this.Url,jObject,{ headers: this.header});
    }
    CheckDuplicateUserGroup(RoleId :string)
    {
      const headerSettings: {[name: string]: string | string[]; } = {};  
      this.header = new HttpHeaders(headerSettings);  
        this.Url = 'http://localhost:57962/api/DefineRole/CheckDuplicateRecord';   
        var jObject = { RoleDetails: JSON.stringify([{ RoleId:RoleId.toUpperCase() }]) };
       return this.http.post<any>(this.Url,jObject,{ headers: this.header});
    }
    GetDataByRoleId(RoleId :string)
    {
      const headerSettings: {[name: string]: string | string[]; } = {};  
      this.header = new HttpHeaders(headerSettings);  
        this.Url = 'http://localhost:57962/api/DefineRole/GetDefineRolesByRoleId';   
        var jObject = { RoleDetails: JSON.stringify([{ RoleId: RoleId }]) };
       return this.http.post<any>(this.Url,jObject,{ headers: this.header});
    }
    chkIfGroupIdisAssociate(RoleId :string)
      {
        const headerSettings: {[name: string]: string | string[]; } = {};  
        this.header = new HttpHeaders(headerSettings);  
        this.Url = 'http://localhost:57962/api/DefineRole/ReferalCheck';   
        var jObject = { RoleDetails: JSON.stringify([{ RoleId: RoleId }]) };
       return this.http.post<any>(this.Url,jObject,{ headers: this.header});
      }

    
}
