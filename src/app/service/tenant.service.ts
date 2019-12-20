import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';  
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  //Url :string;  
  header : any;

  constructor(private http : HttpClient) { 
    //this.Url= localStorage.getItem('arrConfigData');
  }

  GetTenantList(){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);
    //let jObject:any={ ItemList: JSON.stringify([{ CompanyId: ''}]) }; 
    let url=localStorage.getItem('arrConfigData');      
    return this.http.get<any>(url+'/LicenseAssignment/GetTenantList',{ headers: headerSettings});  
   
  }

  GetTenantListByName(Tenant:string){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);
    let jObject:any={ ItemList: JSON.stringify([{ Tenant:Tenant}]) }; 
    let url=localStorage.getItem('arrConfigData');      
    return this.http.post<any>(url+'/LicenseAssignment/GetTenantListByName', jObject,{ headers: headerSettings}); 
  }

  GetUserbyProductList(Tenant:string,Products:string){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);
    let jObject:any={ ItemList: JSON.stringify([{ TenantKey: Tenant, Products: Products}]) };   
    let url=localStorage.getItem('arrConfigData');    
    return this.http.post<any>(url+'/LicenseAssignment/GetUserbyProductList', jObject,{ headers: headerSettings}); 
  }
 
  GetProductsList(){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);
    let jObject:any={ ItemList: JSON.stringify([{ CompanyDBId: '' }]) };     
    let url=localStorage.getItem('arrConfigData');   
    return this.http.post<any>(url+'/LicenseAssignment/GetProductsList', jObject,{ headers: headerSettings}); 
  }

  GetUserList(TenantKey:string){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);
    let jObject:any={ ItemList: JSON.stringify([{ TenantKey: TenantKey }]) };    
    let url=localStorage.getItem('arrConfigData');     
    return this.http.post<any>(url+'/LicenseAssignment/GetUserList', jObject,{ headers: headerSettings}); 
  }

  SaveTenant(ProductArr:any[],UserArr:any[]){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);
    let jObject:any={ ItemList: JSON.stringify(ProductArr), GetData: JSON.stringify(UserArr)};  
    let url=localStorage.getItem('arrConfigData');     
    return this.http.post<any>(url+'/LicenseAssignment/SaveTenantList', jObject,{ headers: headerSettings}); 
  }

  DeleteTenantListByName(TenantKey:string){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);
    let jObject:any={ ItemList: JSON.stringify([{ Tenant: TenantKey }]) };
    let url=localStorage.getItem('arrConfigData');            
    return this.http.post<any>(url+'/LicenseAssignment/DeleteTenantListByName', jObject,{ headers: headerSettings}); 
  }
}
