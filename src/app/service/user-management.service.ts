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
  constructor(private http : HttpClient) { this.Url= localStorage.getItem('arrConfigData');}

FillCompNGrpNSAPUsrNProd()
    { 
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings); 
      return this.http.get<any>(this.Url+'/api/UserManagement/GetCompNGrpNSAPUsrNProd',{ headers: this.header});
    }
FillDDlEmployee(selDataBase:string,BPCode:string)
    { 
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings); 
     if(BPCode==='' || BPCode===null || BPCode===undefined)
       {
        var jObject = { CompanyName: JSON.stringify([{ CompanyDBId: selDataBase }]) };
        return this.http.post<any>(this.Url+'/api/UserManagement/GetEmployee',jObject,{ headers: this.header})
       }
       else {
        if(BPCode==="V")
        {
          BPCode="S"
        }
      var jObject = { CompanyName: JSON.stringify([{ CompanyDBId: selDataBase , bpType: BPCode}]) };
      return this.http.post<any>(this.Url+'/api/UserManagement/GetBusinessPartner',jObject,{ headers: this.header})
       }

      
    }
    
  // FillBusinessPartnerData(selDataBase:string,BPCode:string)
  //   { 
  //     const headerSettings: {[name: string]: string | string[]; } = {
  //       'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
  //     };  
  //     this.header = new HttpHeaders(headerSettings); 
  //     if(BPCode==="V")
  //       {
  //         BPCode="S"
  //       }
  //     var jObject = { CompanyName: JSON.stringify([{ CompanyDBId: selDataBase , bpType: BPCode}]) };
  //     return this.http.post<any>(this.Url+'/api/UserManagement/GetBusinessPartner',jObject,{ headers: this.header})
  //   }
FillGridData()
    { 
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings); 
      return this.http.get<any>(this.Url+'/api/UserManagement/UserDetail',{ headers: this.header});
    }
   
    FillFridOnDropdownSelectedIndexChanged(model : any)
    {
       
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings); 
      var jObject = { RoleDetails: JSON.stringify([{ Product: model.Product}]) };
       
    return this.http.post<any>(this.Url+'/api/DefineRole/GetOperationalMenuList',jObject,{ headers: this.header});
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
                      
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings); 
      return this.http.post<any>(this.Url+'/api/DefineRole/OnAddPress',jObject,{ headers: this.header});
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
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings); 
      return this.http.post<any>(this.Url+'/api/DefineRole/OnUpdatePress',jObject,{ headers: this.header});
    }
    
    CheckDuplicateUserGroup(UserId :string)
    {
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
     
      this.header = new HttpHeaders(headerSettings);   
        var jObject = { UserDetails: JSON.stringify([{ UserId:UserId}]) };
       return this.http.post<any>(this.Url+'/api/UserManagement/CheckDuplicity',jObject,{ headers: this.header});
    }
    GetDataByRoleId(RoleId :string)
    {
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings);   
        var jObject = { RoleDetails: JSON.stringify([{ RoleId: RoleId }]) };
       return this.http.post<any>(this.Url+'/api/DefineRole/GetDefineRolesByRoleId',jObject,{ headers: this.header});
    }

    chkIfGroupIdisAssociate(RoleId :string){
        const headerSettings: {[name: string]: string | string[]; } = {
          'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
        };  
        this.header = new HttpHeaders(headerSettings);   
        var jObject = { RoleDetails: JSON.stringify([{ RoleId: RoleId }]) };
       return this.http.post<any>(this.Url+'/api/DefineRole/ReferalCheck',jObject,{ headers: this.header});
    }

    FillDDlWarehouse(dbname:string, EmpId:string){ 
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings); 
      var jObject = { CompanyName: JSON.stringify([{ CompanyDBId: dbname,EmpId: EmpId }]) };
      return this.http.post<any>(this.Url+'/api/UserManagement/GetWHS',jObject,{ headers: this.header})
    } 

    FillDDlWorkCenter(dbname:string, warehouse:string){ 
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings); 
      var jObject = { CompanyName: JSON.stringify([{ Company: dbname, Warehouse: "'"+warehouse+"'" }]) };
      return this.http.post<any>(this.Url+'/api/UserManagement/GetWorkCenterByWarehouse',jObject,{ headers: this.header})
    } 

    AddUserManagement(SubmitSave:any){ 
      const headerSettings: {[name: string]: string | string[]; } = { 
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings);  
      var jObject = { SubmitSave: JSON.stringify(SubmitSave) };   
      return this.http.post<any>(this.Url+'/api/UserManagement/OnSavePress',jObject,{ headers: headerSettings});
    }

    userRefrenceCheck(userId : any){
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings); 
      var jObject = { UserDetails: JSON.stringify([{ UserId: userId }]) };        
      return this.http.post<any>(this.Url+'/api/UserManagement/UserReferalCheck',jObject,{ headers: this.header});
    }

    DeleteUserManagement(userId : any){
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings); 
      var jObject = { UserDetails: JSON.stringify([{ PreviousUserId: userId }]) };        
      return this.http.post<any>(this.Url+'/api/UserManagement/DeleteUserRecord',jObject,{ headers: this.header});
    }

    getEditDetail(userId : any){
      const headerSettings: {[name: string]: string | string[]; } = {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings); 
      var jObject = { SubmitSave: JSON.stringify([{ UserId: userId }]) };        
      return this.http.post<any>(this.Url+'/api/UserManagement/PopulateRecord',jObject,{ headers: this.header});
    }

    EditUserManagement(SubmitSave:any){ 
      const headerSettings: {[name: string]: string | string[]; } = { 
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings);  
      var jObject = { SubmitSave: JSON.stringify(SubmitSave) };   
      return this.http.post<any>(this.Url+'/api/UserManagement/SubmitUpdate',jObject,{ headers: headerSettings});
    }

    GetSAPUserByGrpId(User:any){ 
      const headerSettings: {[name: string]: string | string[]; } = { 
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      };  
      this.header = new HttpHeaders(headerSettings);  
      
     // UserDetails: [{"UserGroupId":"sfes"}]
      var jObject = {UserDetails: JSON.stringify(User) }
      return this.http.post<any>(this.Url+'/api/UserManagement/GetSAPUserByGrpId',jObject,{ headers: headerSettings});
    }

}
