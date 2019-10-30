import { Component, OnInit } from '@angular/core';
import { products } from '../../dummyData/data';
import { GridComponent } from '@progress/kendo-angular-grid';
import { CheckableSettings } from '@progress/kendo-angular-treeview';
import { of, Observable } from 'rxjs';
import { UserManagementService } from '../../service/user-management.service';
import { MessageService } from '../../common/message.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RowArgs } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})

export class UserManagementComponent implements OnInit {
  selectedItem: string = "";
  public addUserScreen = false;
  dbName : string =""; 
  public checkboxOnly = false;
  public mode = 'multiple';
  public ddlUserGroup: any[];
  public ddlSAPUser: any[];
  public GridCompany: any[];
  public GridUserMgmtProduct: any[];
  public ddlUserType: any[]; 
  public checkedKeys: any[] = [];
  public ddlProductList : any[];
  public ddlCompanyList : any[];
  public oUserSelectedData : any = {}; 
  public OriginalProduct : any = {}; 
  public gridData: any[] ;
  public EmpData: any;
  public databName: any;
  public WH_WC_Data: any;
  public EmpID: any;
  public WHCode: any;
  public WCCode: any;
  public productID: any;
  public user_id: any;
  public user_name: any;
  public password: any;
  public userGroup: any;
  public mapped_user: any;
  public mappedPass: any;
  public tenant: any;
  public accountStatus: any;
  public userType: any;
  public companyName: any;
  public company_data: any;
  public userId: any;
  public re_password: any;
  public companySelection: any[] = [];
  public productSelection: any[] = [];
  public warehouseSelection: any[] = [];
  public workcenterSelection: any[] = [];
  public addscreenmode: any;
  public confirmationOpened = false;
  public Loading: boolean = false;
  
  constructor(private UserManagementService:UserManagementService,private MessageService:MessageService,
    private translate: TranslateService, private httpClientSer: HttpClient) { 
    translate.use(localStorage.getItem('applang'));
    translate.onLangChange.subscribe((event: LangChangeEvent) => { 
    }); 
  }
 
  ngOnInit() {
    this.getUserList();
    this.ddlUserType=[];
    this.ddlUserType.push(
      { text: "Customer", value: "C" }, 
      { text: "Employee", value: "E" }, 
      { text: "Vendor", value: "V" }  
         
    );
    this.FillCompNGrpNSAPUsrNProd();
  }

  
  gridselection(event){
   console.log("item selected from grid");

  }

  onFilterChange(checkBox:any,grid:GridComponent){
    if(checkBox.checked==false){
      //this.clearFilter(grid);
    }
  }

  public addUserScreenToggle() {
    this.addscreenmode = 'add'; 
    this.addUserScreen = !this.addUserScreen; 
    this.user_id = ''; 
    this.user_name = '';
    this.password = '';
    this.re_password = '';
    this.userGroup = {groupCode: ''};
    this.mapped_user = {USER_CODE: ''};
    this.mappedPass = '';
    this.companySelection = [];
    this.productSelection = [];
    this.warehouseSelection = [];
    this.workcenterSelection = [];
    this.accountStatus = 'true'; 
    this.FillCompNGrpNSAPUsrNProd(); 
  }

  getUserList(){
  this.Loading = true;  
  this.UserManagementService.FillGridData().subscribe(    
    data => { 
      if(data != null) {
        this.Loading = false;   
        this.gridData = data; 
      }    
      else{ 
        this.Loading = false;    
        this.MessageService.errormessage(this.translate.instant('Somethingwrong'));    
      }    
    },    
    error => { 
      this.Loading = false;  
      this.MessageService.errormessage(error.message);   
    });
  }
  
  OnUserIdChange() {
      this.UserManagementService.CheckDuplicateUserGroup(this.user_id).subscribe(    
        data => { 
          if(data.length > 0){
            if(data[0].UserCodeCount>0){
              this.MessageService.errormessage('User Id Is Exist');
            }else{
                //  this.IsDuplicate=false;
            }  
          }    
          else{    
            this.MessageService.errormessage(this.translate.instant('Somethingwrong'));
          }    
        },    
        error => {    
          this.MessageService.errormessage(error.message);
        });
  };

  FillCompNGrpNSAPUsrNProd(){
    this.Loading = true;
    this.UserManagementService.FillCompNGrpNSAPUsrNProd().subscribe(    
      data => {    
        if(data != null) {     
          if (data.UserGroup.length > 0) {
            this.ddlUserGroup=[];
            this.ddlUserGroup=data.UserGroup;
        }
        if (data.SAPUser.length > 0) {
          this.ddlSAPUser=[];
          this.ddlSAPUser = data.SAPUser;
        }
        if (data.ProductList.length > 0) {
          this.ddlProductList=[];
          this.ddlProductList=data.ProductList;
        }
        if (data.CompanyList.length > 0) {
          this.ddlCompanyList = [];
          for(let i=0;i<data.CompanyList.length; i++){
            this.UserManagementService.FillDDlEmployee(data.CompanyList[i].dbName).subscribe(
              employeedata => {
                this.Loading = false;
                data.CompanyList[i]["UserType"] = this.ddlUserType;
                data.CompanyList[i]["Employee"] = employeedata;
                data.CompanyList[i]["product"] = this.ddlProductList;
                this.company_data = data.CompanyList;
              });
          }
        }
        }    
        else{ 
          this.Loading = false;
          this.MessageService.errormessage(this.translate.instant('Somethingwrong'));    
        }    
      },    
      error => {
        this.Loading = false;
        this.MessageService.errormessage(error.message);   
      });
  }

/*-- get employee list --*/
  FillDDlEmployee(dbName){
    this.UserManagementService.FillDDlEmployee(dbName).subscribe(    
      data => {    
        if(data != null)   {     
          this.EmpData = data;
        }else{ 
          //this.MessageService.errormessage(this.translate.instant('Somethingwrong')); 
          this.MessageService.errormessage('No Record Found');   
        }    
      },    
      error => {
        this.MessageService.errormessage(error.message);   
      });
  }  

  /*-- get warehouse and workcenter list --*/
  FillDDlWarehouse(dbName){
    this.Loading = true;
    this.UserManagementService.FillDDlWarehouse(dbName, '').subscribe(
      warehousedata => {
        for(let i=0;i<warehousedata.Table.length; i++){
          this.UserManagementService.FillDDlWorkCenter(this.databName, warehousedata.Table[i].OPTM_WHSE).subscribe(
            WorkCenterdata => {
              this.Loading = false;
              warehousedata.Table[i]["workcenter"] = WorkCenterdata;
              this.WH_WC_Data = warehousedata.Table;
            });
          }
      });  
  }  


  companyClickHandler({dataItem}){
    this.databName = dataItem.dbName;
    this.companyName = dataItem.cmpName;
    this.FillDDlWarehouse(dataItem.dbName);
  }

  companySelectionChange(e){
    this.databName = e.selectedRows[0].dataItem.dbName;
    this.companyName = e.selectedRows[0].dataItem.cmpName;
  }

  productClickHandler({dataItem}){

  }

  productSelectionChange(e){
    console.log(e);
   // this.productID = e.selectedRows[0].dataItem.ProductId;
  }

  productSelect(event: any, productId){
    if(event.target.checked === true){
      this.productID = productId;
    }else{
      this.productID = '';
    }
  }

  warehouseClickHandler({dataItem}){

  }

  warehouseSelectionChange(e){
    this.WHCode = e.selectedRows[0].dataItem.OPTM_WHSE;
  }

  workCenterClickHandler({dataItem}){
    this.WCCode = dataItem.WorkCenterCode;
  }

  workCenterSelectionChange(e){
    this.WCCode = e.selectedRows[0].dataItem.WorkCenterCode;
  }

  onChangeUserType(e, index, CPdata){
    if(e.value === 'C'){
      let productByStoreID = this.ddlProductList.filter(product => product.ProductId === 'CVP');
      this.company_data[index]["product"] = productByStoreID;
    }

    if(e.value === 'V'){
      let productByStoreID = this.ddlProductList.filter(product => product.ProductId === 'CVP' 
      ||  product.ProductId === 'MMO');
      this.company_data[index]["product"] = productByStoreID;
    }

    if(e.value === 'E'){
      let productByStoreID = this.ddlProductList.filter(product => product.ProductId === 'ATD' 
      ||  product.ProductId === 'SFES' || product.ProductId === 'WMS' || product.ProductId === 'CNF'
      ||  product.ProductId === 'MMO' || product.ProductId === 'DSB');
      this.company_data[index]["product"] = productByStoreID;
    }
    this.userType = e.value;
  }

  onChangeEmployeeId(e){
    this.EmpID = e.empID;
  }

  saveRecord(mode){ 
    this.Loading = true; 
    var SubmitSave:any = {};
    SubmitSave.EmployeeId = [];
    SubmitSave.Warehouse = [];
    SubmitSave.WorkCenter = [];
    SubmitSave.Product = [];
    SubmitSave.Company = [];
    SubmitSave.Values = [];
    SubmitSave.PreviousUserId = [];

    SubmitSave.EmployeeId.push({
      Company: this.databName,
      empID: this.EmpID,
      bussPart: ""
    });
    SubmitSave.Warehouse.push({
      Company: this.databName,
      Id: this.WHCode,
      EmployeeId: this.EmpID,
      bussPart: ""
    });
    SubmitSave.WorkCenter.push({
      Company: this.databName,
      WorkCenterCode: this.WCCode,
      Warehouse: this.WHCode,
      productCode: this.productID,
      EmployeeId: this.EmpID,
      bussPart: ""
    });
    SubmitSave.Product.push({
      Company: this.databName,
      productCode: this.productID,
      EmployeeId: this.EmpID,
      bussPart: ""
    });
    SubmitSave.Company.push({
      Company: this.databName
    });
    SubmitSave.Values.push({
      UserId: this.user_id,
      Username: this.user_name,
      Password: this.password,
      UserGroup: this.userGroup.groupCode,
      IsActive: this.accountStatus,
      Company: this.databName,
      SAPUser: this.mapped_user.USER_CODE,
      SAPPassword: this.mappedPass,
      UserType: this.userType
    });
    SubmitSave.PreviousUserId.push();
    if(mode == 'add'){
      this.UserManagementService.AddUserManagement(SubmitSave).subscribe(
        data => {
          this.Loading = false; 
          this.MessageService.successmessage("Successfully saved data!");
          this.addUserScreen = !this.addUserScreen; 
          this.getUserList();
        },    
        error => {  
          this.Loading = false; 
          this.MessageService.errormessage(error.message);
      });
    }else{
      this.UserManagementService.EditUserManagement(SubmitSave).subscribe(
        data => {
          this.Loading = false; 
          this.MessageService.successmessage("Successfully updated data!");
          this.addUserScreen = !this.addUserScreen; 
          this.getUserList();
        },    
        error => {
          this.Loading = false;   
          this.MessageService.errormessage(error.message);
      });  
    }
  }

  userClickHandler({dataItem}){
    this.Loading = true;
    this.addscreenmode = 'edit'; 
    this.userId = dataItem.OPTM_USERCODE;
    this.getEditDetailById(this.userId);
    this.addUserScreen = !this.addUserScreen; 
  }

  public confirmationToggle() {
    this.confirmationOpened = !this.confirmationOpened;
  }

  userRefrenceCheck(mode){
    this.confirmationOpened=false;
    this.Loading = true;
    this.UserManagementService.userRefrenceCheck(this.userId).subscribe(    
      data => {    
         if(data[0].OPTMCODECOUNT == 0 && mode == 'delete'){
          this.deleteRecord();
         }else if(data[0].OPTMCODECOUNT == 0 && mode == 'edit'){
           this.saveRecord(mode);
         }else{
            this.getUserList();
         }
      },    
      error => {
        this.MessageService.errormessage(error.message);   
      });
  }
  
  deleteRecord(){
    this.UserManagementService.DeleteUserManagement(this.userId).subscribe(    
      data => { 
        this.Loading = false;   
        this.MessageService.successmessage("Successfully delete data!");
        this.addUserScreen = !this.addUserScreen; 
        this.getUserList();
      },    
      error => {
        this.Loading = false;  
        this.MessageService.errormessage(error.message); 
      });
  }
  
  getEditDetailById(userId){
    this.UserManagementService.getEditDetail(userId).subscribe(    
      data => { 
       if(data[0]){
        this.Loading = false; 
        this.company_data.forEach((element, index) => {
          if(element.dbName === data[0].OPTM_COMPID){
            if(data[0].OPTM_USERTYPE == 'C'){
              this.company_data[index]["selectedUserType"] = { text: "Customer", value: data[0].OPTM_USERTYPE };
            }else if(data[0].OPTM_USERTYPE == 'E'){
              this.company_data[index]["selectedUserType"] = { text: "Employee", value: data[0].OPTM_USERTYPE };
            }else if(data[0].OPTM_USERTYPE == 'V'){
              this.company_data[index]["selectedUserType"] = { text: "Vendor", value: data[0].OPTM_USERTYPE };
            }
           /* console.log(data[0].OPTM_EMPID);
            let EmployeeID = element.Employee.filter(id => id.empID === data[0].OPTM_EMPID);
            console.log(EmployeeID);*/
           //this.company_data[index]["product"] = productByStoreID;
          }
        });
       // console.log(this.company_data);
        this.user_id = data[0].OPTM_USERCODE; 
        this.user_name = data[0].OPTM_USERNAME;
        this.password = data[0].OPTM_PASSWORD;
        this.re_password = data[0].OPTM_PASSWORD;
        this.userGroup = {groupCode: data[0].OPTM_GROUPCODE};
        this.mapped_user = {USER_CODE: data[0].OPTM_SAPUSER};
        this.mappedPass = data[0].OPTM_SAPPASSWORD;
        this.companySelection = [data[0].OPTM_COMPID];
        this.productSelection = [data[0].OPTM_OPTIADDON];
        this.productID = data[0].OPTM_OPTIADDON;
        this.warehouseSelection = [data[0].OPTM_WHSE];
        this.workcenterSelection = [data[0].OPTM_WORKCENTER];
        if(data[0].OPTM_ACTIVE == 1){
           this.accountStatus = 'true';
        }else{
           this.accountStatus = 'false';
        }   
       } 
      },    
      error => {
        this.Loading = false;    
        this.MessageService.errormessage(error.message);   
      }); 
  }

  cancel(){
    this.addUserScreen = !this.addUserScreen; 
  }
}
