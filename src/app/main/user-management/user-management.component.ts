import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
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
  public employeeData: any;
  public dbClickName: any;
  public dbClickEmployeeName: any;
  public dbClickProductName: any;
  public SubmitSave:any = {};
  public dbClickUserType: any;
  public PreviousUserId: any;
  public companyss: any;
  public SelectedRowData: any;
  public TenantKey: any;
  public dbClickWarehouseCompany: any[];
  public dbClickWorkcenterCompany: any[];
  public WCIndex: any;

  constructor(private cd: ChangeDetectorRef, private UserManagementService:UserManagementService,private MessageService:MessageService,
    private translate: TranslateService, private httpClientSer: HttpClient) { 
    translate.use(localStorage.getItem('applang'));
    translate.onLangChange.subscribe((event: LangChangeEvent) => { 
    }); 
  }
 
  ngOnInit() {
    this.getUserList();
    this.SubmitSave.EmployeeId = [];
    this.SubmitSave.Warehouse = [];
    this.SubmitSave.WorkCenter = [];
    this.SubmitSave.Product = [];
    this.SubmitSave.Company = [];
    this.SubmitSave.Values = [];
    this.SubmitSave.PreviousUserId = [];
    this.ddlUserType=[];
    this.ddlUserType.push(
      { text: "Customer", value: "C" }, 
      { text: "Employee", value: "E" }, 
      { text: "Vendor", value: "V" }  
         
    );
    this.FillCompNGrpNSAPUsrNProd();
  }

  /*-- get list of users --*/
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
  
  /*-- on click add users icon --*/ 
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
  }

  /*-- get list of company and product --*/
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
          this.ddlProductList = data.ProductList;
        }
        if (data.CompanyList.length > 0) {
          this.ddlCompanyList = [];
          for(let i=0;i<data.CompanyList.length; i++){
            const element = data.CompanyList[i];
            let products = JSON.parse(JSON.stringify(this.ddlProductList));
            for (let j = 0; j < products.length; j++) {      
              products[j]["UniqueId"] = i+''+j;       
            }
            element["product"] = products;
            this.UserManagementService.FillDDlEmployee(data.CompanyList[i].dbName).subscribe(
              employeedata => {
                this.Loading = false;
                this.employeeData = employeedata;
                data.CompanyList[i]["UserType"] = this.ddlUserType;
                data.CompanyList[i]["Employee"] = employeedata;
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

  /*-- get warehouse and workcenter list --*/
  FillDDlWarehouse(dbName, clickCompanyNameWarehouse, clickCompanyNameWorkcenter, WCIndex){
    this.Loading = true;
    this.UserManagementService.FillDDlWarehouse(dbName, '').subscribe(
      warehousedata => {
        for(let i=0;i<warehousedata.Table.length; i++){
          warehousedata.Table[i]["company"] = dbName;
          for(let j=0;j<clickCompanyNameWarehouse.length; j++){
              if(warehousedata.Table[i].company == clickCompanyNameWarehouse[j].Company 
                && warehousedata.Table[i].OPTM_WHSE == clickCompanyNameWarehouse[j].Id){
                  warehousedata.Table[i]["checked"] = true;
                }
          }  
          this.UserManagementService.FillDDlWorkCenter(this.dbClickName, warehousedata.Table[i].OPTM_WHSE).subscribe(
            WorkCenterdata => {
              this.Loading = false;
              warehousedata.Table[i]["workcenter"] = WorkCenterdata;
              /*for(let l=0; l<warehousedata.Table[i].workcenter.length; l++){
                warehousedata.Table[i].workcenter[l]["unique_id"] = WCIndex;
                warehousedata.Table[i].workcenter[l]["checked"] = false;
              }*/
              for(let k=0;k<clickCompanyNameWorkcenter.length; k++){
                if(warehousedata.Table[i].company == clickCompanyNameWorkcenter[k].Company 
                  && warehousedata.Table[i].WorkCenterCode == clickCompanyNameWarehouse[k].WorkCenterCode){
                    warehousedata.Table[i]["workcenter"]["checked"] = true;
                    warehousedata.Table[i]["workcenter"]["index"] = WCIndex;
                  }
              }
              this.WH_WC_Data = warehousedata.Table;
              console.log(this.WH_WC_Data[i]);
            });
          }
      });  
  } 
   
  /*-- on change user type get list of products --*/
  onChangeUserType(e, index, CPdata){
    //console.log(this.company_data[index].product);
    //console.log(CPdata[index].product);
    if(e.value === 'C'){
      let productByStoreID = this.company_data[index].product.filter(product => product.ProductId === 'CVP');
      this.company_data[index]["product"] = productByStoreID;
      this.company_data[index]["BPCode"] = true;
      //console.log(this.company_data[index]);
    }

    if(e.value === 'V'){
      let productByStoreID = this.company_data[index].product.filter(product => product.ProductId === 'CVP' 
      ||  product.ProductId === 'MMO');
      this.company_data[index]["product"] = productByStoreID;
      this.company_data[index]["BPCode"] = true;
      //console.log(this.company_data[index]);
    }

    if(e.value === 'E'){
      let productByStoreID = this.company_data[index].product.filter(product => product.ProductId === 'ATD' 
      ||  product.ProductId === 'SFES' || product.ProductId === 'WMS' || product.ProductId === 'CNF'
      ||  product.ProductId === 'MMO' || product.ProductId === 'DSB');
      this.company_data[index]["product"] = productByStoreID;
      this.company_data[index]["BPCode"] = false;
     // console.log(this.company_data[index]);
    }
    this.userType = e.value;
  }

  companyClickHandler(e){
    this.WH_WC_Data = '';
    this.WCIndex = e.rowIndex;
    this.cd.detectChanges();
    this.dbClickName = e.dataItem.dbName;
    if(e.dataItem.selectedUserType){
      this.dbClickUserType = e.dataItem.selectedUserType.value;
    }
    if(e.dataItem.selectedEmployeeType){
      this.dbClickEmployeeName = e.dataItem.selectedEmployeeType.empID;
    }
    let array = [];
    this.SubmitSave.Product.forEach((value, index) => {
        if(value.pIndex === e.rowIndex){
          array.push( value.productCode );
        }
    });
    this.dbClickProductName = array.toString();
    this.companyName = e.dataItem.cmpName;
    this.dbClickWarehouseCompany = [];
    this.SubmitSave.Warehouse.forEach((e, index) => {
      if(this.dbClickName === e.Company){
        this.dbClickWarehouseCompany.push(e);
      }
    });
    this.dbClickWorkcenterCompany = [];
    this.SubmitSave.WorkCenter.forEach((e, index) => {
      if(this.dbClickName === e.Company){
        this.dbClickWorkcenterCompany.push(e);
      }
    });
    this.FillDDlWarehouse(e.dataItem.dbName, this.dbClickWarehouseCompany, this.dbClickWorkcenterCompany, this.WCIndex);
  }

 
  companySelect(event: any, companyData, companyIndex){
    if(event.target.checked === true){
      this.databName = companyData.dbName;
      this.companyName = companyData.cmpName;
      this.SubmitSave.Company.push({Company: this.databName, cIndex: companyIndex});            
    }else{
      let whatIndex = null;
      this.SubmitSave.Company.forEach((value, index) => {
        if(value.Company == companyData.dbName){
            whatIndex = index;
        }
      }); 
      this.SubmitSave.Company.splice(whatIndex, 1);    
    } 
  }

  productSelect(event: any, product, productIndex){
    
    if(event.target.checked === true){
      this.productID = product;
      this.SubmitSave.Product.push({Company: this.databName, productCode: this.productID, EmployeeId: this.EmpID, pIndex: productIndex, bussPart: ""});
    }else{
      let whatIndexTwo = null;
      this.SubmitSave.Product.forEach((value, index) => {
        if(value.productCode == product){
            whatIndexTwo = index;
        }
      }); 
      this.SubmitSave.Product.splice(whatIndexTwo, 1);    
    } 
  }

  warehouseSelect(event, warehouseData, warehouseIndex){
    if(event.target.checked === true){
      this.WHCode = warehouseData.OPTM_WHSE;
      this.SubmitSave.Warehouse.push({Company: this.dbClickName, Id: this.WHCode, EmployeeId: this.EmpID, 
        WHIndex: warehouseIndex, bussPart: ""});
    }else{
      let whatIndex3 = null;
      this.SubmitSave.Warehouse.forEach((value, index) => {
        if(value.Id == warehouseData.OPTM_WHSE){
            whatIndex3 = index;
        }
      }); 
      this.SubmitSave.Warehouse.splice(whatIndex3, 1); 
    }
  }

  workCenterSelect(event, workCenterData, workCenterIndex){
    if(event.target.checked === true){
      this.WCCode = workCenterData[0].WorkCenterCode;
      this.SubmitSave.WorkCenter.push({Company: this.dbClickName, EmployeeId: this.EmpID, productCode: this.dbClickProductName, WorkCenterCode: this.WCCode, WCIndex: workCenterIndex, bussPart: ""});
    }else{
      let whatIndex4 = null;
      this.SubmitSave.WorkCenter.forEach((value, index) => {
        if(value.WorkCenterCode == workCenterData.WorkCenterCode){
            whatIndex4 = index;
        }
      }); 
      this.SubmitSave.WorkCenter.splice(whatIndex4, 1);    
    } 
  }

  onChangeEmployeeId(e, db, index){
      this.EmpID = e.empID;
      this.SubmitSave.EmployeeId.push({
        Company: db,
        empID: this.EmpID,
        bussPart: "",
        eIndex: index,
      });
  }

  
  saveRecord(mode){
    if(this.userGroup.groupCode == ''){
      this.MessageService.errormessage("please select user group");
    }else if(this.mapped_user.USER_CODE == ''){
      this.MessageService.errormessage("please select SAP user");
    }else if(this.SubmitSave.Company.length == 0){
      this.MessageService.errormessage("please choose at least one company");
    }
   
      this.SubmitSave.Company.forEach((c, cindex) => {
        this.SubmitSave.Product.forEach((p, pindex) => {
          if(c.cIndex === p.pIndex){
             this.SubmitSave.Product[pindex]["Company"] =  c.Company;
          }
        });
      });
  
      this.SubmitSave.EmployeeId.forEach((e, eindex) => {
        this.SubmitSave.Product.forEach((p, pindex) => {
          if(e.eIndex === p.pIndex){
             this.SubmitSave.Product[pindex]["EmployeeId"] =  e.empID;
          }
        });
      });
  
      this.SubmitSave.Warehouse.forEach((WH, WHindex) => {
        this.SubmitSave.WorkCenter.forEach((WC, WCindex) => {
          if(WH.WHIndex === WC.WCIndex){
             this.SubmitSave.WorkCenter[WCindex]["Warehouse"] =  WH.Id;
          }
        });
      });
   //  console.log(JSON.stringify(this.SubmitSave.Product));
  
      this.SubmitSave.Values.push({
        UserId: this.user_id,
        Username: this.user_name,
        Password: this.password,
        UserGroup: this.userGroup.groupCode,
        IsActive: this.accountStatus,
        Company: this.dbClickName,
        SAPUser: this.mapped_user.USER_CODE,
        SAPPassword: this.mappedPass,
        //UserType: this.dbClickUserType
        UserType: this.userType,
        PreviousUserId: this.PreviousUserId
      });
  
      this.SubmitSave.PreviousUserId.push({PreviousUserId: this.PreviousUserId});
  
      this.SubmitSave.Company.map(function(c) {
        delete c['cIndex'];
        return c; 
      });
      
      this.SubmitSave.Product.map(function(p) {
        delete p['pIndex'];
        return p; 
      });
  
      this.SubmitSave.Warehouse.map(function(WH) {
        delete WH['WHIndex'];
        return WH; 
      });
  
      this.SubmitSave.WorkCenter.map(function(WC) {
        delete WC['WCIndex'];
        return WC; 
      });
  
      this.SubmitSave.EmployeeId.map(function(Emp) {
        delete Emp['eIndex'];
        return Emp; 
      });
       if(mode == 'add'){
        this.Loading = true; 
        this.UserManagementService.AddUserManagement(this.SubmitSave).subscribe(
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
        this.Loading = true; 
        this.UserManagementService.EditUserManagement(this.SubmitSave).subscribe(
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

  getEditDetailById(userId){
   /* this.UserManagementService.getEditDetail(userId).subscribe(    
      data => { 
        if(data){
          this.company_data.forEach((element, index) => {
            data.forEach((element2, index2) => {
              if(element.dbName == element2.OPTM_COMPID){
                this.company_data[index]["checked"] = true;
                this.companySelection.push(element2.OPTM_COMPID);
              }
            });  
          }); 
        }
        //OPTM_OPTIADDON
        console.log(data);
        this.company_data.forEach((element, index) => {
          data.forEach((element2, index2) => {

          });  
        });  
      
       if(data[0]){
        this.Loading = false;
        this.user_id = data[0].OPTM_USERCODE; 
        this.user_name = data[0].OPTM_USERNAME;
        this.password = data[0].OPTM_PASSWORD;
        this.re_password = data[0].OPTM_PASSWORD;
        this.userGroup = {groupCode: data[0].OPTM_GROUPCODE};
        this.mapped_user = {USER_CODE: data[0].OPTM_SAPUSER};
        this.mappedPass = data[0].OPTM_SAPPASSWORD;
        this.PreviousUserId = userId;
        this.WCCode = data[0].OPTM_WORKCENTER;
        this.WHCode = data[0].OPTM_WHSE;
        this.userType = data[0].OPTM_USERTYPE;
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
        this.PreviousUserId = userId;
        if(data[0].OPTM_ACTIVE == 1){
           this.accountStatus = 'true';
        }else{
           this.accountStatus = 'false';
        }    
        console.log(data);
        this.company_data.forEach((element, index) => {
          if(element.dbName === data[0].OPTM_COMPID){
            if(data[0].OPTM_USERTYPE == 'C'){
              this.company_data[index]["selectedUserType"] = { text: "Customer", value: data[0].OPTM_USERTYPE };
            }else if(data[0].OPTM_USERTYPE == 'E'){
              this.company_data[index]["selectedUserType"] = { text: "Employee", value: data[0].OPTM_USERTYPE };
            }else if(data[0].OPTM_USERTYPE == 'V'){
              this.company_data[index]["selectedUserType"] = { text: "Vendor", value: data[0].OPTM_USERTYPE };
            } 
            let empID = this.company_data[index].Employee.filter(i => i.empID == data[0].OPTM_EMPID);
            this.company_data[index]["selectedEmployeeType"] = empID[0];
          }
        });
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
      }); */
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
              let empID = this.company_data[index].Employee.filter(i => i.empID == data[0].OPTM_EMPID);
              this.company_data[index]["selectedEmployeeType"] = empID[0];
            }
          });
          this.WCCode = data[0].OPTM_WORKCENTER;
          this.WHCode = data[0].OPTM_WHSE;
          this.userType = data[0].OPTM_USERTYPE;
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
          this.PreviousUserId = userId;
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

  onBlurUserID() {
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
  
  cancel(){
    this.addUserScreen = !this.addUserScreen; 
  }
}
