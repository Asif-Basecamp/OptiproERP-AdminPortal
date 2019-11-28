import { Component, OnInit } from '@angular/core';
//import { products } from '../../dummyData/data';
import { GridComponent, RowClassArgs } from '@progress/kendo-angular-grid';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TenantService } from 'src/app/service/tenant.service';
import { MessageService } from '../../common/message.service';
import { filterBy } from '@progress/kendo-data-query';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss']
})

export class TenantComponent implements OnInit {

  // public paginationButtonCount = 5;
  // public paginationInfo = true;
  // public paginationType: 'input';
  // public paginationPageSizes = true;
  // public paginationInfoPreviousNext = true;

  selectedItem: string = ""; 
  public checkedKeys: any[] = [];

  public TenantList: any [];
  public defaultTenant: any;
  public ProductData: any[];
  public UserData: any[];  
  public addTenantScreen: boolean = false;
  public TenantId: any;
  public isEdit:boolean = false;
  public TenantDataArr: any =[];
  public ProdCodeArr:any = [];
  public showViewGridPage:boolean = false;
  public showUserGridPage:boolean = false;
  public isColumnFilterView:boolean = false;
  public isColumnFilterUser:boolean = false;
  public loading = false;
  public FilterData: any[];
  public showTenantMainPage: boolean = false;
  public confirmationOpenedEdit = false; 

  constructor(private translate: TranslateService, private httpClientSer: HttpClient, private tenantService: TenantService,
    private MessageService:MessageService, private commonService: CommonService) { 
      translate.use(localStorage.getItem('applang'));
        translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.selectedItem = translate.instant("Login_Username"); 
        }); 
    }    
    //this.setSelectableSettings();
   
  ngOnInit() {
    this.getTenantList();
   
    // this.isMobile();
  }

  onLicenseCountChange(value,rowindex){

    if(value == '' || value == undefined || value == null){
      this.MessageService.errormessage(this.translate.instant('Enter_License_Count'));
      return;
    }

    let diff = value - this.ProductData[rowindex].extnValue;
   
    if(diff > this.ProductData[rowindex].REMAINING){
      this.ProductData[rowindex].showErrorMsg = true;
      return;
    }
    else{
      this.ProductData[rowindex].showErrorMsg = false;
      this.ProductData[rowindex].EXTNCODE = value;
      this.ProductData[rowindex].rowcheck = true; 
    }       
  }

  public addTenantScreenToggle(mode) {
    this.isColumnFilterView = false;
    this.isColumnFilterUser = false;
    this.addTenantScreen = !this.addTenantScreen;  
    if(mode == 'add'){
      this.addRecord();
    } 
    else if(mode == 'edit'){
      this.editRecord();
    }
  }

  addRecord(){
    this.isEdit = false;
    this.TenantId = '';
    this.getProductsList('New');
    this.getUsersList('');
  } 
  
  editRecord(){    
    this.loading = true;
    this.getTenantListByName(this.TenantId);
  }

   ProductListNew(){
    this.ProdCodeArr = [];
    if(this.ProductData != null && this.ProductData != undefined){
      if(this.ProductData.length > 15)
        this.showViewGridPage = true;
    }
    else{
      console.log("No products found!");
    } 
   }

  ProductListUpdate(){

    this.ProdCodeArr = [];
    for(let i =0; i<this.ProductData.length; i++){
      for(let j =0; j<this.TenantDataArr.length; j++){
        if(this.TenantDataArr[j].PRODUCTKEY == this.ProductData[i].OPTM_PRODCODE && this.TenantDataArr[j].EXTNCODE > 0){
            this.ProductData[i].EXTNCODE = this.TenantDataArr[j].EXTNCODE;
            this.ProductData[i].rowcheck = true;
            this.ProductData[i].extnValue= this.TenantDataArr[j].EXTNCODE;
            this.ProdCodeArr.push(this.ProductData[i].OPTM_PRODCODE);
        }
      }     
    }
    this.getUserByProductList(this.TenantId,this.ProdCodeArr);  
  }

  getProductsList(action){   
    this.loading = true;    
    this.tenantService.GetProductsList().subscribe(
      data => {        
        this.ProductData = data;

        if(this.ProductData != null && this.ProductData != undefined){
          this.ProductData = this.ProductData.filter(function(obj){
            obj['rowcheck'] = false;
            obj['showErrorMsg'] = false;
            obj['extnValue'] = obj.EXTNCODE;
            return obj;
          }); 
        }

        if(action == 'New')
        this.ProductListNew();
        else        
        this.ProductListUpdate(); 
        this.loading = false;       
      },
      error => {
        this.loading = false; 
        if(error.error != null && error.error != undefined){
          if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
            this.commonService.unauthorizedToken(error);               
          }
        }
        else{
          this.MessageService.errormessage(error.message);
        }
    });
      
  }

  getUsersList(paramTenant){
    
    this.tenantService.GetUserList(paramTenant).subscribe(
      data => {
        this.UserData = data;
        
        if(this.UserData != null && this.UserData != undefined){
          this.UserData = this.UserData.filter(function(obj){
            obj['rowcheck'] = false;
            return obj;
          });

          if(this.UserData.length > 15)
          this.showUserGridPage = true;
        }
        else{
          console.log("No user found!");
        }        
      },
      error => {
        this.loading = false; 
        if(error.error != null && error.error != undefined){
          if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
            this.commonService.unauthorizedToken(error);               
          }
        }
        else{
          this.MessageService.errormessage(error.message);
        }
    });
  }

  editTenant($event){
    this.TenantId = $event.selectedRows[0].dataItem.TENANTKEY;
    this.isEdit = true;
    this.addTenantScreenToggle('edit'); 
  }

  selectProduct(checkvalue,rowdata,index){

    for(let i=0; i < this.ProductData.length; i++){
      if(this.ProductData[i].OPTM_PRODCODE == rowdata.OPTM_PRODCODE){
        if(checkvalue == true){
          this.ProductData[i].rowcheck = true; 
          this.ProdCodeArr.push(rowdata.OPTM_PRODCODE);  
        }       
        else {
          this.ProductData[i].rowcheck = false;        
          this.ProductData[i].EXTNCODE = 0; 
          var idx = this.ProdCodeArr.indexOf(rowdata.OPTM_PRODCODE);
          if(idx > -1)
          this.ProdCodeArr.splice(idx,1);     
        } 
      }
    }

    // if(!this.isEdit)
    // this.getUserByProductList('',this.ProdCodeArr);
    // else
    // this.getUserByProductList(this.TenantId,this.ProdCodeArr);
  }

  selectUser(checkvalue,rowdata,index){  

    let userList = this.UserData;
     userList.filter(function(value,key){
      if(value.OPTM_USERCODE == rowdata.OPTM_USERCODE){
       if(checkvalue == true)
        userList[key].rowcheck = true;        
       else
        userList[key].rowcheck = false; 
      }
    })     
    this.UserData = userList;        
  }

  on_Selectall_checkbox_checked(checkall){
    if(checkall == true){
      for(let i=0; i<this.ProductData.length;i++){
        this.ProductData[i].rowcheck = true;
      }
    }
    else{
      for(let i=0; i<this.ProductData.length;i++){
        this.ProductData[i].rowcheck = false;
      }
    }
  }

  user_Selectall_checkbox_checked(checkall){    
    if(checkall == true){
      for(let i=0; i<this.UserData.length;i++){
        this.UserData[i].rowcheck = true;
      }
    }
    else{
      for(let i=0; i<this.UserData.length;i++){
        this.UserData[i].rowcheck = false;
      }
    }
  }

  getTenantList(){   
    this.loading = true;
    this.tenantService.GetTenantList().subscribe(
      data => { 
        this.loading = false;    
        if(data != null && data != undefined){
          if(data.length > 0){           
           this.TenantList = data; 
           this.FilterData = data;   
           if(this.TenantList.length > 15)   
           this.showTenantMainPage = true;
           else
           this.showTenantMainPage = false;
          }
        } 
        else{
          this.MessageService.errormessage(this.translate.instant('No_Tenant_Found'));
        } 
        this.loading = false;
      },    
      error => {  
        this.loading = false;  
        if(error.error != null && error.error != undefined){
          if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
            this.commonService.unauthorizedToken(error);               
          }
        }
        else{
          this.MessageService.errormessage(error.message);
        }
    }); 
  }

  getTenantListByName(tenantName){
    
    this.tenantService.GetTenantListByName(tenantName).subscribe(
      data => {
        if(data != null && data != undefined){  
          this.TenantDataArr = data; 
          this.loading = false;       
          this.getProductsList('Update');          
        }
        else {          
          console.log("Error in GetTenantListByName");
          this.loading = false;
        }   
            
    },
    error => {
      this.loading = false; 
      if(error.error != null && error.error != undefined){
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
      }
      else{
        this.MessageService.errormessage(error.message);
      }
    });
  }

  getUserByProductList(TenantKey,Products){   
  
  this.UserData = [];
    let str = '';
    for (let i = 0; i < Products.length; i++) {

      if(Products[i] == 'SFD')
        Products[i] = 'SFES';

      if (i == 0) {
       str = "'"+Products[i]+"'";
      } else {
       str = str + ',' + "'"+Products[i]+"'";
      }
     }

    this.tenantService.GetUserbyProductList(TenantKey,str).subscribe(
      data => {
        this.UserData = data;
         if(this.UserData != null && this.UserData != undefined){
           
            if(TenantKey != ''){
              this.UserData = this.UserData.filter(function(obj){
                if(obj.OPTM_TENANTKEY == TenantKey)
                  obj['rowcheck'] = true;
                else
                  obj['rowcheck'] = false;
                return obj;
              });               
            }
            else{
              this.UserData = this.UserData.filter(function(obj){
                  obj['rowcheck'] = false;
                return obj;
              }); 
           }  
          }         

          if(this.UserData.length > 15)
           this.showUserGridPage = true;
          // }
          else{
            console.log("No user found!");         
          }
     },
      error => {
        this.loading = false; 
        if(error.error != null && error.error != undefined){
          if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
            this.commonService.unauthorizedToken(error);               
          }
        }
        else{
          this.MessageService.errormessage(error.message);
        }
    });
  }

  SaveRecord(operation){

    this.confirmationOpenedEdit = false;
    this.loading = true;
    let TempProductData = [];
    let TempUserData = [];
    let tenant = this.TenantId;
    let flagProduct = false;
    let flagUser = false;

    for(let i=0; i< this.ProductData.length; i++){
      if(this.ProductData[i].rowcheck == true){
        if(this.ProductData[i].EXTNCODE == 0){
          this.MessageService.errormessage(this.translate.instant('Enter_License_Count'));
          this.loading = false;
          return;
        }
        if(this.ProductData[i].showErrorMsg == true){
          this.MessageService.errormessage(this.translate.instant('Enter_Correct_License_Count'));
          this.loading = false;
          return;
        }
        flagProduct = true;
        let map = {};
        map['Product'] = this.ProductData[i].OPTM_PRODCODE;
        map['License'] = this.ProductData[i].EXTNCODE;
        map['Tenant'] = tenant;
        map['Operation'] = operation;
        TempProductData.push(map);
      }
    }

    if(flagProduct == false){
      this.MessageService.errormessage(this.translate.instant('Select_One_Product'));
      this.loading = false;
      return;
    }

    if(this.UserData != null || this.UserData != undefined){
      if(this.UserData.length >0){
        for(let i=0; i< this.UserData.length; i++){
          if(this.UserData[i].rowcheck == true){
            flagUser = true;
            let map = {};
            map['User'] = this.UserData[i].OPTM_USERCODE;
            map['TenantKey'] = tenant;
            TempUserData.push(map);
          }
        }
        if(flagUser == false){
          this.MessageService.errormessage(this.translate.instant('Select_One_User'));
          this.loading = false;
          return;
        }    
      }
      else{
        this.MessageService.errormessage(this.translate.instant('No_User'));
        this.loading = false;
        return;
      }
    }
    else{
      this.MessageService.errormessage(this.translate.instant('No_User'));
      this.loading = false;
      return;
    }
    
    this.tenantService.SaveTenant(TempProductData,TempUserData).subscribe(
      data => {
        
        if(operation == 'New'){
          if(data.length > 0){
            for(let i=0; i<data.length; i++){
              this.MessageService.errormessage(data[i].Message + ' in ' + data[i].Tenant);
              }
            }
            else{
              this.MessageService.successmessage(this.translate.instant('Record_Saved_Success'));
              this.addTenantScreenToggle('');
              
            } 
          }
        else {
          if(data.length > 0){
            for(let i=0; i<data.length; i++){
              this.MessageService.errormessage(data[i].Message + ' in ' + data[i].Product);
              }
            }
            else{
              this.MessageService.successmessage(this.translate.instant('RecordUpdate'));
              this.addTenantScreenToggle('');
                       
            } 
        }
        this.loading = false;
        this.getTenantList();
    },
    error => {
      this.loading = false;
      if(error.error != null && error.error != undefined){
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
      }
      else{
        this.MessageService.errormessage(error.message);
      }
    });
  }

  DeleteRecord($event){
    this.loading = true;
    console.log(this.TenantId);
    this.tenantService.DeleteRecord(this.TenantId).subscribe(
      data => { 
        if (data == true){
          this.MessageService.successmessage(this.translate.instant('Record_deleted'));
          this.addTenantScreenToggle('');  
        } 
        else{
          this.MessageService.errormessage(this.translate.instant('Error_Delete_Record'));
          return;
        }
       
        this.loading = false;
        this.getTenantList();
    },
    error => {
      this.loading = false;
      if(error.error != null && error.error != undefined){
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
      }
      else{
        this.MessageService.errormessage(error.message);
      }
    });
  }

  CancelRecord(action){
    if(this.isEdit)
    {
      this.confirmationEditToggle();
      if(action == 'confirm'){
        this.isEdit = false;
        this.addTenantScreenToggle('');
      }     
    }
    else{
      this.isEdit = false;
      this.addTenantScreenToggle('');
    }    
  }

  public confirmationEditToggle() {  
    this.confirmationOpenedEdit = !this.confirmationOpenedEdit;    
  }

  numberOnly(event){
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onInput(filter) {
    
    this.TenantList = filterBy(this.FilterData, {
     
     field:'TENANTKEY',     
     operator: 'contains',
     value: filter,    
    }); 
  }

  onFilterChange(checkBox:any,grid:GridComponent){
    if(checkBox.checked==false){
      this.clearFilter(grid);
    }
  }

  clearFilter(grid:GridComponent){      
    //grid.filter.filters=[];    
    //this.clearFilters();
  }

  // public isMobile(): void {
  //   if(window.innerWidth <= 991){
  //     // this.paginationInfo = false;
  //     this.paginationPageSizes = false; 
  //     this.paginationInfoPreviousNext = false;  
  //     this.paginationButtonCount = 3;                 
  //   }
  // }

//   public setSelectableSettings(): void {
//     this.selectableSettings = {
//         checkboxOnly: this.checkboxOnly,
//         mode: this.mode
//     };
// }

}


