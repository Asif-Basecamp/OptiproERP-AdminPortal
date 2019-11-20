import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';  
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  Url :string;  
  header : any;

  constructor(private http : HttpClient) { 
    this.Url= localStorage.getItem('arrConfigData');
  }

  GetTenantList(){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);
    //let jObject:any={ ItemList: JSON.stringify([{ CompanyId: ''}]) };       
    return this.http.get<any>(this.Url+'/LicenseAssignment/GetTenantList',{ headers: headerSettings});  
   
  }

  GetTenantListByName(Tenant:string){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);
    let jObject:any={ ItemList: JSON.stringify([{ Tenant:Tenant}]) };       
    return this.http.post<any>(this.Url+'/LicenseAssignment/GetTenantListByName', jObject,{ headers: headerSettings}); 
  }

  GetUserbyProductList(Tenant:string,Products:string){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);
    let jObject:any={ ItemList: JSON.stringify([{ TenantKey: Tenant, Products: Products}]) };       
    return this.http.post<any>(this.Url+'/LicenseAssignment/GetUserbyProductList', jObject,{ headers: headerSettings}); 
  }
 
  GetProductsList(){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);
    let jObject:any={ ItemList: JSON.stringify([{ CompanyDBId: '' }]) };       
    return this.http.post<any>(this.Url+'/LicenseAssignment/GetProductsList', jObject,{ headers: headerSettings}); 
  }

  GetUserList(TenantKey:string){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);
    let jObject:any={ ItemList: JSON.stringify([{ TenantKey: TenantKey }]) };       
    return this.http.post<any>(this.Url+'/LicenseAssignment/GetUserList', jObject,{ headers: headerSettings}); 
  }

  SaveTenant(ProductArr:any[],UserArr:any[]){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);
    let jObject:any={ ItemList: JSON.stringify(ProductArr), GetData: JSON.stringify(UserArr)};      
    return this.http.post<any>(this.Url+'/LicenseAssignment/SaveTenantList', jObject,{ headers: headerSettings}); 
  }

  DeleteRecord(TenantKey:string){
    const headerSettings: {[name: string]: string | string[]; } = { 
      'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    };  
    this.header = new HttpHeaders(headerSettings);
    let jObject:any={ ItemList: JSON.stringify([{ TenantKey: TenantKey }]) };       
    return this.http.post<any>(this.Url+'/LicenseAssignment/DeleteRecord', jObject,{ headers: headerSettings}); 
  }
}
