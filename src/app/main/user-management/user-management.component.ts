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
import { filterBy } from '../../../../node_modules/@progress/kendo-data-query';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})

export class UserManagementComponent implements OnInit {
  public addUserScreen = false;
  dbName: any; 
  public ddlUserGroup: any[];
  public ddlSAPUser: any[];
  public ddlUserType: any[]; 
  public ddlProductList : any[];
  public ddlCompanyList : any[];
  public userData: any[] ;
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
  public dbClickEmployeeName: any;
  public dbClickProductName: any;
  public SubmitSave:any = {};
  public dbClickUserType: any;
  //public TenantKey: any;
  public WCIndex: any;
  public gridRefresh: any;
  public PreviousUserId: any;
  public editUserData: any;
  public ShowDBName:string;
  public FilterData: any[];
  public ShowCompanyName: string;
  constructor(private cd: ChangeDetectorRef, private UserManagementService:UserManagementService,private MessageService:MessageService,
    private translate: TranslateService, private httpClientSer: HttpClient) { 
    translate.use(localStorage.getItem('applang'));
    translate.onLangChange.subscribe((event: LangChangeEvent) => { 
    }); 
  }
 
  ngOnInit() {
    this.getUserList();
    this.SubmitSave.EmployeeId =[];
    this.SubmitSave.Company = [];
    this.SubmitSave.Product = [];
    this.SubmitSave.Warehouse = [];
    this.SubmitSave.WorkCenter = [];
    this.SubmitSave.Values = [];
    this.SubmitSave.PreviousUserId = [];
    this.EmpID=[]
    
    this.ddlUserType=[];
    this.ddlUserType.push(
      { text: "Customer", value: "C" }, 
      { text: "Employee", value: "E" }, 
      { text: "Vendor", value: "V" });
      this.FillCompNGrpNSAPUsrNProd();
  }

  /*-- get list of users --*/
  getUserList(){
    this.Loading = true;  
    this.UserManagementService.FillGridData().subscribe(    
      data => { 
        if(data != null) {
          this.Loading = false;   
          this.userData = data;
          this.FilterData =data;
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
    this.SubmitSave.EmployeeId=[];
    //this.FillCompNGrpNSAPUsrNProd();
   // this.SubmitSave=[];
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
                data.CompanyList[i]["selectedEmployeeType"] = {empID: '', firstName: "Emp ID"};
                data.CompanyList[i]["selectedUserType"] = { text: "User Type", value: '' };
                data.CompanyList[i]["selectedCompany"] = 'blank';
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
   
  /*-- on change user type get list of products --*/
  onChangeUserType(e, index, CPdata){
    const element = this.company_data[index];
    let products = JSON.parse(JSON.stringify(this.ddlProductList));
    for (let j = 0; j < products.length; j++) {      
      products[j]["UniqueId"] = index+''+j;       
    }
    element["product"] = products;
    if(e.value === 'C'){
      let productByStoreID = element.product.filter(product => product.ProductId === 'CVP');
      this.company_data[index]["product"] = productByStoreID;
      this.company_data[index]["BPCode"] = true;
    }
    if(e.value === 'V'){
      let productByStoreID = element.product.filter(product => product.ProductId === 'CVP' 
      ||  product.ProductId === 'MMO');
      this.company_data[index]["product"] = productByStoreID;
      this.company_data[index]["BPCode"] = true;
    }

    if(e.value === 'E'){
      let productByStoreID = element.product.filter(product => product.ProductId === 'ATD' 
      ||  product.ProductId === 'SFES' || product.ProductId === 'WMS' || product.ProductId === 'CNF'
      ||  product.ProductId === 'MMO' || product.ProductId === 'DSB');
      this.company_data[index]["product"] = productByStoreID;
      this.company_data[index]["BPCode"] = false;
    }
    this.userType = e.value;
  }

  /*-- get warehouse and workcenter list --*/
  FillDDlWarehouse(dbName, index){
    this.Loading = true;
    this.gridRefresh = false;
    this.UserManagementService.FillDDlWarehouse(dbName, '').subscribe(
      warehousedata => {
      
        for(let i=0;i<warehousedata.Table.length; i++){
          warehousedata.Table[i]["uniqueId"] = index+''+i;
          this.WHGetSelectiondata(warehousedata.Table[i], i); 
          this.UserManagementService.FillDDlWorkCenter(dbName, warehousedata.Table[i].OPTM_WHSE).subscribe(
            WorkCenterdata => {
              this.Loading = false;
               warehousedata.Table[i]["workcenter"] = WorkCenterdata;
               for (let j = 0; j < warehousedata.Table[i].workcenter.length; j++) {      
                warehousedata.Table[i].workcenter[j]["uniqueId"] = dbName+''+i+''+j;  
                this.WCGetSelectiondata(warehousedata.Table[i].workcenter[j], i);      
               }
            });
          }
        this.WH_WC_Data = warehousedata.Table;
      });  
  } 

  WHGetSelectiondata(WHData, WHIndex){
    
    if(this.editUserData){
      //onsole.log(this.editUserData)
    //  this.company_data.forEach((element, index) => {
        this.editUserData.forEach((element2, index2) => {
          
          //if(element.dbName === element2.OPTM_COMPID){
            if(this.ShowDBName === element2.OPTM_COMPID){
            if(WHData.OPTM_WHSE === element2.OPTM_WHSE){
              this.SubmitSave.Warehouse.push({Company: element2.OPTM_COMPID, Id: element2.OPTM_WHSE, 
                EmployeeId: element2.OPTM_EMPID, 
                WHIndex: WHIndex, bussPart: ""});
              this.SubmitSave.Warehouse = this.removeDuplicatesValue(this.SubmitSave.Warehouse, 'Id');
              this.warehouseSelection.push(WHData.uniqueId);
            }
          }
        });  
    //  });
    }
  }

  WCGetSelectiondata(WCData, WCIndex){
  if(this.editUserData){
    //this.company_data.forEach((element, index) => {
      this.editUserData.forEach((element2, index2) => {
        //if(element.dbName === element2.OPTM_COMPID){
          if(this.ShowDBName === element2.OPTM_COMPID){
          if(WCData.WorkCenterCode === element2.OPTM_WORKCENTER){
              this.SubmitSave.WorkCenter.push({Company:  element2.OPTM_COMPID, EmployeeId: element2.OPTM_EMPID, 
                productCode: element2.OPTM_OPTIADDON, WorkCenterCode: element2.OPTM_WORKCENTER, WCIndex: WCIndex, 
                bussPart: ""});
              this.SubmitSave.WorkCenter = this.removeDuplicatesValue(this.SubmitSave.WorkCenter, 'WorkCenterCode'); 
              this.workcenterSelection.push(WCData.uniqueId);
          }
        }
      });  
    //});
  }
  }

  companyClickHandler(e){
    if(e.dataItem.selectedEmployeeType.empID != ''){
      this.dbName = e.dataItem.dbName;
      this.ShowDBName=e.dataItem.dbName;
      this.ShowCompanyName=e.dataItem.cmpName;
      if(e.dataItem.selectedUserType){
        this.dbClickUserType = e.dataItem.selectedUserType.value;
      }
      if(e.dataItem.selectedEmployeeType){
        this.dbClickEmployeeName = e.dataItem.selectedEmployeeType.empID;
        this.EmpID = e.dataItem.selectedEmployeeType.empID;
      }
      this.FillDDlWarehouse(e.dataItem.dbName, e.rowIndex);
    }else{
      this.MessageService.errormessage("please select employee"); 
    }
  } 

  onExpandCompany(event){
    if(event.dataItem.selectedCompany == 'blank'){
      this.MessageService.errormessage("please choose company"); 
    }
  }

  onExpandWarehouse(event){
    /*if(event.dataItem.selectedWarehouse == 'blank'){
      this.MessageService.errormessage("please choose Warehouse"); 
    }*/
  }
 
  companySelect(event: any, companyData, companyIndex){
    if(event.target.checked === true){
      this.company_data[companyIndex]["selectedCompany"] = companyData.dbName;
    }else{
      this.company_data[companyIndex]["selectedCompany"] = 'blank';
    }
    
    /*-- employee array --*/
    if(event.target.checked === true){
      this.SubmitSave.EmployeeId.push({Company: companyData.dbName, 
        empID: companyData.selectedEmployeeType.empID,
        bussPart: "", eIndex: companyIndex});
    }else{
      let whatIndex = null;
      this.SubmitSave.EmployeeId.forEach((value, index) => {
        if(value.Company == companyData.dbName){
            whatIndex = index;
        }
      }); 
      this.SubmitSave.EmployeeId.splice(whatIndex, 1);    
    }    

    /*-- company array --*/
   // console.log(this.SubmitSave.Company);
    if(event.target.checked === true){
      this.SubmitSave.Company.push({Company: companyData.dbName, cIndex: companyIndex});            
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

  productSelect(event: any, product, productIndex, rowIndex){
    if(event.target.checked === true){
      this.productID = product;
      this.SubmitSave.Product.push({productCode: this.productID, pIndex: rowIndex, bussPart: ""});
    }else{
      let whatIndexTwo = null;
      this.SubmitSave.Product.forEach((value, index) => {
        if(value.productCode == product){
            whatIndexTwo = index;
        }
      }); 
      this.SubmitSave.Product.splice(whatIndexTwo, 1);    
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

    let array = [];
      this.SubmitSave.Product.forEach((value, index) => {
        if(value.pIndex === rowIndex){
          array.push( value.productCode );
        }
      });
      this.dbClickProductName = array.toString();
  }

  warehouseSelect(event, warehouseData, warehouseIndex){
   
    if(event.target.checked === true){
      this.WH_WC_Data[warehouseIndex]["selectedWarehouse"] = warehouseData.OPTM_WHSE;
    }else{
      this.WH_WC_Data[warehouseIndex]["selectedWarehouse"] = 'blank';
    }
    
    if(event.target.checked === true){
      this.WHCode = warehouseData.OPTM_WHSE;
      this.SubmitSave.Warehouse.push({Company: this.dbName, Id: this.WHCode, EmployeeId: this.EmpID, 
        WHIndex: warehouseIndex, bussPart: ""});
    }else{
      let whatIndex3 = null;
      this.SubmitSave.Warehouse.forEach((value, index) => {
        if(value.Id === warehouseData.OPTM_WHSE){
            whatIndex3 = index;
        }
      }); 
      this.SubmitSave.Warehouse.splice(whatIndex3, 1); 
    }
  }

  workCenterSelect(event, workCenterData, workCenterIndex){
    
    if(event.target.checked === true){
      this.WCCode = workCenterData.WorkCenterCode;
      this.SubmitSave.WorkCenter.push({Company: this.dbName, EmployeeId: this.EmpID, 
      productCode: this.dbClickProductName, WorkCenterCode: this.WCCode, WCIndex: workCenterIndex, 
      bussPart: ""});
    }else{
      let whatIndex4 = null;
      this.SubmitSave.WorkCenter.forEach((value, index) => {
        if(value.WorkCenterCode == workCenterData.WorkCenterCode){
            whatIndex4 = index;
        }
      }); 
      this.SubmitSave.WorkCenter.splice(whatIndex4, 1);    
    }

    //console.log(this.SubmitSave.Warehouse)
    this.SubmitSave.Warehouse.forEach((WH, WHindex) => {
      this.SubmitSave.WorkCenter.forEach((WC, WCindex) => {
        if(WH.WHIndex === WC.WCIndex){
           this.SubmitSave.WorkCenter[WCindex]["Warehouse"] =  WH.Id;
        }
      });
    });
  }

  onChangeEmployeeId(e, db, index){
    this.company_data[index]["selectedEmployeeType"] = e;
  }

  saveRecord(mode){
    this.SubmitSave.Values.push({
      UserId: this.user_id,
      Username: this.user_name,
      Password: this.password,
      UserGroup: this.userGroup.groupCode,
      IsActive: this.accountStatus,
      Company: this.dbName,
      SAPUser: this.mapped_user.USER_CODE,
      SAPPassword: this.mappedPass,
      UserType: this.userType,
      PreviousUserId: this.PreviousUserId,
      TenantKey: this.tenant
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

    console.log(JSON.stringify(this.SubmitSave));

    this.Loading = false; 
    if(mode == 'add'){
        this.Loading = true; 
        this.UserManagementService.AddUserManagement(this.SubmitSave).subscribe(
          data => {
            this.Loading = false; 
            this.MessageService.successmessage("Successfully saved data!");
            this.addUserScreen = !this.addUserScreen; 
            this.getUserList();
            //this.ngOnInit();
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
            this.SubmitSave='';
           // this.addUserScreenToggle();
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

  removeDuplicatesValue(array, key) {
    return array.filter((obj, index, self) =>
        index === self.findIndex((el) => (
            el[key] === obj[key]
        ))
    )
  }

  getEditDetailById(userId){
    var Warehouse=[];
    var WorkCenter=[];
    var wc=[];
    this.UserManagementService.getEditDetail(userId).subscribe(    
      data => { 
        this.editUserData = data;
          debugger
        this.Loading = false;
        if(data[0]){
          this.user_id = data[0].OPTM_USERCODE; 
          this.user_name = data[0].OPTM_USERNAME;
          this.password = data[0].OPTM_PASSWORD;
          this.re_password = data[0].OPTM_PASSWORD;
          this.userGroup = {groupCode: data[0].OPTM_GROUPCODE};
          this.mapped_user = {USER_CODE: data[0].OPTM_SAPUSER};
          this.mappedPass = data[0].OPTM_SAPPASSWORD;
          this.PreviousUserId = userId;
          
          this.tenant=data[0].OPTM_TENANTKEY;
          if(data[0].OPTM_ACTIVE == 1){
            this.accountStatus = 'true';
         }else{
            this.accountStatus = 'false';
         }  
        } 
       
        /*-- company and product selection --*/
        this.company_data.forEach((element, index) => {
          this.editUserData.forEach((element2, index2) => {
            if(element.dbName === element2.OPTM_COMPID){
             
              this.SubmitSave.Warehouse.push({
                      Id: element2.OPTM_WHSE,
                       Company: element2.OPTM_COMPID,
                       EmployeeId: element2.OPTM_EMPID
              })
              this.SubmitSave.WorkCenter.push({
                Company: element2.OPTM_COMPID,
                WorkCenterCode: element2.OPTM_WORKCENTER,
                Warehouse: element2.OPTM_WHSE,
                productCode: element2.OPTM_OPTIADDON,
                EmployeeId: element2.OPTM_EMPID
        })
              this.SubmitSave.Company.push({Company: this.company_data[index].dbName, cIndex: index}); 
              this.SubmitSave.Company = this.removeDuplicatesValue(this.SubmitSave.Company, 'Company');
              
              this.companySelection.push(element2.OPTM_COMPID);

              const element = this.company_data[index];
              let products = JSON.parse(JSON.stringify(this.ddlProductList));
              for (let j = 0; j < products.length; j++) {      
                products[j]["UniqueId"] = index+''+j;       
              }
              element["product"] = products;

              if(element2.OPTM_USERTYPE == 'C'){
                this.company_data[index]["selectedUserType"] = { text: "Customer", value: element2.OPTM_USERTYPE };

                let productByStoreID = element.product.filter(product => product.ProductId === 'CVP');
                this.company_data[index]["product"] = productByStoreID;
                this.company_data[index]["BPCode"] = true;

              }else if(element2.OPTM_USERTYPE == 'E'){
                this.company_data[index]["selectedUserType"] = { text: "Employee", value: element2.OPTM_USERTYPE };

                let productByStoreID = element.product.filter(product => product.ProductId === 'ATD' 
                ||  product.ProductId === 'SFES' || product.ProductId === 'WMS' || product.ProductId === 'CNF'
                ||  product.ProductId === 'MMO' || product.ProductId === 'DSB');
                this.company_data[index]["product"] = productByStoreID;
                this.company_data[index]["BPCode"] = false;

              }else if(element2.OPTM_USERTYPE == 'V'){
                this.company_data[index]["selectedUserType"] = { text: "Vendor", value: element2.OPTM_USERTYPE };

                let productByStoreID = element.product.filter(product => product.ProductId === 'CVP' 
                ||  product.ProductId === 'MMO');
                this.company_data[index]["product"] = productByStoreID;
                this.company_data[index]["BPCode"] = true;
              }
              this.userType = element2.OPTM_USERTYPE;

              let empID = this.company_data[index].Employee.filter(i => i.empID == element2.OPTM_EMPID);
              this.company_data[index]["selectedEmployeeType"] = empID[0];

              this.SubmitSave.EmployeeId.push({Company: this.company_data[index].dbName, 
                empID: this.company_data[index].selectedEmployeeType.empID,
                bussPart: "", eIndex: index});

              this.SubmitSave.EmployeeId = this.removeDuplicatesValue(this.SubmitSave.EmployeeId, 'Company');
              
              this.company_data[index]["selectedCompany"] = element2.OPTM_COMPID;
              
              if(element2.OPTM_OPTIADDON!=null && element2.OPTM_OPTIADDON!=''){
                let productSplitArray = element2.OPTM_OPTIADDON.includes(',')? element2.OPTM_OPTIADDON.split(','):[element2.OPTM_OPTIADDON];
                for(let j=0; j<productSplitArray.length; j++){
                  let productUniqueID = this.company_data[index].product.filter(i => i.ProductId == productSplitArray[j]);
                
                  if(productUniqueID.length>0){
                    this.productSelection.push(productUniqueID[0].UniqueId);

                    this.SubmitSave.Product.push({productCode: productSplitArray[j], pIndex: index, 
                      bussPart: "",
                      Company: this.company_data[index].dbName, EmployeeId: element2.OPTM_EMPID});

                    this.SubmitSave.Product = this.removeDuplicatesValue(this.SubmitSave.Product, 'productCode');
                    }
                  }
              }
              
            }
             /*-- get warehouse and workcenter list --*/
  
            
          });  
        });
    }, error => {
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

  onChange(e){
    
    var UserGrpId=[{"UserGroupId": e.groupCode}];
    this.UserManagementService.GetSAPUserByGrpId(UserGrpId).subscribe(    
      data => { 
        if(data.length>0)
        {
          this.mapped_user = {USER_CODE: data[0].OPTM_SAPUSER};
         
          this.mappedPass=data[0].OPTM_SAPPASSWORD;
          
        }
      },    
      error => {
        
        this.MessageService.errormessage(error.message); 
      });
  
  }
  
  cancel(){
    this.addUserScreen = !this.addUserScreen; 
  }
  onInput(filter) {
    
    this.userData = filterBy(this.FilterData, {
     
      field:'OPTM_USERCODE',
      operator: 'contains',
     value: filter,
    //   filters: [
    //     { field: "OPTM_GROUPCODE", operator: "contains", value: filter },
    //     { field: "OPTM_DESCRIPTION", operator: "contains", value:filter },
    // ]
    }); 
  }
  clearFilter(grid:GridComponent){      
    grid.filter.filters=[];
  }


  
}
