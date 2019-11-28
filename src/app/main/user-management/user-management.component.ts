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
import { Router } from '../../../../node_modules/@angular/router';
import { CommonService } from 'src/app/service/common.service';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})

export class UserManagementComponent implements OnInit {
  cats(arg0: any): any {
    throw new Error("Method not implemented.");
  }
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
  public BPID: any;
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
  public BPData: any;
  public dbClickEmployeeName: any;
  public dbClickBPName: any;
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
  public FlagWH: boolean = true;
  public FlagProduct: boolean = true;
  public FlagEmployee: boolean = true;
  public FlagWC: boolean = true;
  public selectedItem: any[];
  public IsValidate:boolean=false;
  public IsComparePassword:boolean=true;
  public IsEditMode:boolean=false;
  public IsEditWorkcenter:boolean=false;
  public showGridUserMgmtPage: boolean = false;
  public confirmationOpenedEdit = false; 

  constructor(private _router: Router,private cd: ChangeDetectorRef, private UserManagementService:UserManagementService,private MessageService:MessageService,
    private translate: TranslateService, private httpClientSer: HttpClient,private commonService: CommonService) { 
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
    this.BPID=''
    this.tenant='';
    
    this.ddlUserType=[];
    this.ddlUserType.push(
      { text: "Customer", value: "C" }, 
      { text: "Employee", value: "E" }, 
      { text: "Vendor", value: "V" });
      //this.selectedItem = this.ddlUserType["E"];
      this.FillCompNGrpNSAPUsrNProd();
  }

  public confirmationEditToggle() {  
    this.confirmationOpenedEdit = !this.confirmationOpenedEdit;    
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

          if(this.userData.length > 15){
            this.showGridUserMgmtPage = true;
          }
          else{
            this.showGridUserMgmtPage = false;
          } 
        }    
        else{ 
          this.Loading = false;    
          this.MessageService.errormessage(this.translate.instant('UserMgmtSomethimgWntWrngMsg'));    
        }    
      },    
      error => { 
        this.Loading = false;  
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
    this.SubmitSave.EmployeeId =[];
    this.SubmitSave.Company = [];
    this.SubmitSave.Product = [];
    this.SubmitSave.Warehouse = [];
    this.SubmitSave.WorkCenter = [];
    this.SubmitSave.Values = [];
    this.SubmitSave.PreviousUserId = [];
    this.EmpID=[];
    this.BPID='';
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
            data.CompanyList[i]["UserType"] = this.ddlUserType;
            //data.CompanyList[i]["Employee"] = employeedata;
            data.CompanyList[i]["selectedEmployeeType"] = {empID: '', firstName: "--Select--"};
            data.CompanyList[i]["selectedBP"] = {CardCode: '', CardName: "--Select--"};
            data.CompanyList[i]["selectedUserType"] = { text: "--Select--", value: '' };
            data.CompanyList[i]["selectedCompany"] = 'blank';
            this.company_data = data.CompanyList;
           
          }
        }
        }    
        else{ 
          this.Loading = false;
          this.MessageService.errormessage(this.translate.instant('UserMgmtSomethimgWntWrngMsg'));    
        }    
      },    
      error => {
        //this.Loading = false;
        this.MessageService.errormessage(error.message); 
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
   //Get Employee Data
   FillEmployee(e, index, CPdata)
     {
       this.Loading=true;
       let DatabaseName=CPdata[index].dbName;
       this.UserManagementService.FillDDlEmployee(DatabaseName,"").subscribe(
        employeedata => {
          this.Loading = false;
          this.employeeData = employeedata;
          //data.CompanyList[i]["UserType"] = this.ddlUserType;
          this.company_data[index]["Employee"] = employeedata;
         
        },  error => {    
          //this.MessageService.errormessage(error.message);
          this.Loading=false;
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

      //Get Businiss Partner Data
   FillBusinessPartnerData(e, index, CPdata)
   {
     this.Loading=true
     let DatabaseName=CPdata[index].dbName;
    this.UserManagementService.FillDDlEmployee(DatabaseName,e.value).subscribe(
      BPData => {
        this.Loading = false;
        this.BPData = BPData;
        //data.CompanyList[i]["UserType"] = this.ddlUserType;
        this.company_data[index]["listItems"] = BPData;
       
      },
      error => {    
        //this.MessageService.errormessage(error.message);
        this.Loading=false;
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
  
  /*-- on change user type get list of products --*/
 
  onChangeUserType(e, index, CPdata){
    
    if(this.dbClickUserType===undefined || this.dbClickUserType==='')
       {

       }
       else if(this.dbClickUserType!=CPdata[index].selectedUserType.value)
         {
          this.MessageService.errormessage(this.translate.instant('UserSameUserTypeErrMsg')); 
           CPdata[index]["selectedUserType"] = { text: "--Select--", value: '' };
           return
         }
    //if(CPdata[index].selectedUserType.value===undefined )
    
    if(e.value==="C" || e.value==="V")
     {
      this.FillBusinessPartnerData(e, index, CPdata)
     }
     else {
      this.FillEmployee(e, index, CPdata);
     }
   
 
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
   delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
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
              this.delay(5000).then(any=>{
                if(warehousedata.Table[i].workcenter.length>0){
                  for (let j = 0; j < warehousedata.Table[i].workcenter.length; j++) {      
                    warehousedata.Table[i].workcenter[j]["uniqueId"] = dbName+''+i+''+j;  
                    this.WCGetSelectiondata(warehousedata.Table[i].workcenter[j], i);      
                   }
                }
               
                //your task after delay.
           });
               
              // return Observable.from(WorkCenterdata).delay(2000);
               
            });
          }
        this.WH_WC_Data = warehousedata.Table;
      },
      error => {    
        //this.MessageService.errormessage(error.message);
        this.Loading=false;
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
                WHIndex: WHIndex,  bussPart:element2.OPTM_BPCODE});
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
               bussPart:element2.OPTM_BPCODE});
              this.SubmitSave.WorkCenter = this.removeDuplicatesValue(this.SubmitSave.WorkCenter, 'WorkCenterCode'); 
              this.workcenterSelection.push(WCData.uniqueId);
          }
        }
      });  
    //});
  }
  }

  companyClickHandler(e){
    this.userType=e.dataItem.selectedUserType.value;
    //if(e.dataItem.selectedEmployeeType.empID != '' && this.userType !=''){
      this.dbName = e.dataItem.dbName;
      this.ShowDBName=e.dataItem.dbName;
      this.ShowCompanyName=e.dataItem.cmpName;
      
      this.dbClickUserType = e.dataItem.selectedUserType.value;
           
      if(e.dataItem.BPCode){
         this.BPID=e.dataItem.selectedBP.CardCode;
      }
      if(e.dataItem.selectedEmployeeType){
        this.dbClickEmployeeName = e.dataItem.selectedEmployeeType.empID;
        this.EmpID = e.dataItem.selectedEmployeeType.empID;
      }
      this.FillDDlWarehouse(e.dataItem.dbName, e.rowIndex);
   
  } 

  onExpandCompany(event){
    if(event.dataItem.selectedCompany == 'blank'){
      this.MessageService.errormessage(this.translate.instant('UserMgmtCompanySelectMsg')); 
    }
  }

  onExpandWarehouse(event){
    /*if(event.dataItem.selectedWarehouse == 'blank'){
      this.MessageService.errormessage("please choose Warehouse"); 
    }*/
  }
 
  companySelect(event: any, companyData, companyIndex){
    if(companyData.selectedUserType.value==='')
       {
        this.MessageService.errormessage(this.translate.instant('UserTypeValidationmsg'));
         return;
       }
    if(event.target.checked === true){
      this.company_data[companyIndex]["selectedCompany"] = companyData.dbName;
    }else{
      this.company_data[companyIndex]["selectedCompany"] = 'blank';
    }
    
    /*-- employee array --*/
   // this.BPID=companyData.selectedBP.CardCode;
    if(event.target.checked === true){
      if(companyData.selectedUserType.value==='E')
         {
           if(companyData.selectedEmployeeType.empID ==='' || companyData.selectedEmployeeType.empID===undefined)
              {
                this.MessageService.errormessage(this.translate.instant('EmployeeValidationmsg'));
                return;
              }
         }
        else {
          if(companyData.selectedBP.CardCode ==='' || companyData.selectedBP.CardCode===undefined)
              {
                this.MessageService.errormessage(this.translate.instant('BPCodeValidationmsg'));
                return;
              }
        }
      this.SubmitSave.EmployeeId.push({Company: companyData.dbName, 
        empID: companyData.selectedEmployeeType.empID,
        bussPart: companyData.selectedBP.CardCode, eIndex: companyIndex});
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
      this.SubmitSave.Product.push({productCode: this.productID, pIndex: rowIndex, bussPart: this.BPID});
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
   
    if(this.IsEditMode)
     {
        if(event.target.checked === true){
          for(let i=0; i <this.SubmitSave.WorkCenter.length; i++)
           {
             if(this.dbName===this.SubmitSave.WorkCenter[i].Company && this.SubmitSave.WorkCenter[i].Warehouse==='' || this.SubmitSave.WorkCenter[i].Warehouse=== undefined)
              {
                this.SubmitSave.WorkCenter[i].Warehouse= warehouseData.OPTM_WHSE;
              }
              
           }
      }
    }
    if(event.target.checked === true){
      this.WH_WC_Data[warehouseIndex]["selectedWarehouse"] = warehouseData.OPTM_WHSE;
    }else{
      this.WH_WC_Data[warehouseIndex]["selectedWarehouse"] = 'blank';
    }
    
    if(event.target.checked === true){
      this.WHCode = warehouseData.OPTM_WHSE;
      this.SubmitSave.Warehouse.push({Company: this.dbName, Id: this.WHCode, EmployeeId: this.EmpID, 
        WHIndex: warehouseIndex, bussPart: this.BPID});
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
  WorkCenterSelectEditMode(event, workCenterData, workCenterIndex)
   {
    this.IsEditWorkcenter=false;
    if(event.target.checked === true)
    {
      
      for(let i=0; i< this.SubmitSave.WorkCenter.length; i++)
     {
      if(this.SubmitSave.WorkCenter[i].Warehouse===workCenterData.Warehouse && this.dbName===this.SubmitSave.WorkCenter[i].Company)
        {
         this.SubmitSave.WorkCenter[i].WorkCenterCode=workCenterData.WorkCenterCode;
         this.SubmitSave.WorkCenter[i].productCode=this.dbClickProductName;
         this.IsEditWorkcenter=true;
         return;
        }
     }
   }
   else {
     let whatIndex4 = null;
     this.SubmitSave.WorkCenter.forEach((value, index) => {
       if(value.WorkCenterCode == workCenterData.WorkCenterCode){
           whatIndex4 = index;
       }
     }); 
     this.SubmitSave.WorkCenter.splice(whatIndex4, 1);
     this.IsEditWorkcenter=true; 
     return; 
   }
     
   if(this.IsEditWorkcenter===false)
         {
          let  TempProductKey="";
          let  TempSoreProductKey="";
           for(let k=0; k<this.SubmitSave.WorkCenter.length; k++)
            {
              if(this.dbName===this.SubmitSave.WorkCenter[k].Company)
                 {
                   TempProductKey=this.SubmitSave.WorkCenter[k].productCode;
                 }
            }
          
            if(this.dbClickProductName !=undefined){
              TempSoreProductKey=this.dbClickProductName;
            }
            if(TempProductKey !='' && TempProductKey!=null)
            {
              TempSoreProductKey=TempProductKey;
            }

              if(event.target.checked === true){
                this.WCCode = workCenterData.WorkCenterCode;
                this.SubmitSave.WorkCenter.push({Company: this.dbName, EmployeeId: this.EmpID, 
                productCode: TempSoreProductKey, WorkCenterCode: this.WCCode, Warehouse: workCenterData.Warehouse, 
                bussPart: this.BPID});
                this.IsEditWorkcenter=true;
              }else{
                let whatIndex4 = null;
                this.SubmitSave.WorkCenter.forEach((value, index) => {
                  if(value.WorkCenterCode == workCenterData.WorkCenterCode){
                      whatIndex4 = index;
                  }
                }); 
                this.SubmitSave.WorkCenter.splice(whatIndex4, 1);
                this.IsEditWorkcenter=true;    
              }
            }
            //alert('Selecrt ProductName');
        
         }
  workCenterSelect(event, workCenterData, workCenterIndex){
    
    if(this.IsEditMode)
        { 
         this.WorkCenterSelectEditMode(event, workCenterData, workCenterIndex);
       }
        if(this.IsEditWorkcenter===false)
         {
          if(event.target.checked === true){
            this.WCCode = workCenterData.WorkCenterCode;
            if(this.EmpID==='' && this.BPID==='')
                {
                  this.MessageService.errormessage(this.translate.instant('EmployeeAndBPValidationmsg'));
                  return;
                }
            if(this.dbClickProductName!='' && this.dbClickProductName!=undefined)
               {
                this.SubmitSave.WorkCenter.push({Company: this.dbName, EmployeeId: this.EmpID, 
                  productCode: this.dbClickProductName, WorkCenterCode: this.WCCode, WCIndex: workCenterIndex, 
                  bussPart: this.BPID});
               }
               else {
                this.MessageService.errormessage(this.translate.instant('UserMgmtProductSelectMsg'));
                 return; 
               }
           
          }else{
            let whatIndex4 = null;
            this.SubmitSave.WorkCenter.forEach((value, index) => {
              if(value.WorkCenterCode == workCenterData.WorkCenterCode){
                  whatIndex4 = index;
              }
            }); 
            this.SubmitSave.WorkCenter.splice(whatIndex4, 1);    
          }
              this.SubmitSave.Warehouse.forEach((WH, WHindex) => {
                this.SubmitSave.WorkCenter.forEach((WC, WCindex) => {
                  if(WH.WHIndex === WC.WCIndex){
                     this.SubmitSave.WorkCenter[WCindex]["Warehouse"] =  WH.Id;
                  }
                });
              });
         }
  }

  onChangeEmployeeId(e, db, index){
    this.company_data[index]["selectedEmployeeType"] = e;
  }
  onChangeBPID(e, db, index)
   {
    this.company_data[index]["selectedBP"] = e;
    
   }

   ProductValidation()
      {
        let elemntProduct="";
        // Product Company
      if(this.SubmitSave.Product.length>0)
      {
        for(let j=0; j<this.SubmitSave.Product.length; j++)
        {
          elemntProduct = elemntProduct + ','+ this.SubmitSave.Product[j].Company
        }
      }
      else {
        this.MessageService.errormessage(this.translate.instant('UserMgmtSomethimgWntWrngMsg'));
      }
          
      if(this.SubmitSave.Product.length>0)
      {
        
            this.SubmitSave.Company.forEach((c, pindex) => {
            
                  if(elemntProduct.includes(c.Company))
                  {
                    this.FlagProduct=true;
                  }
                  else {
                    this.MessageService.errormessage(this.translate.instant('UserMgmtProductSelectMsg')+' '+c.company);
                    this.FlagProduct=false;
                    this.IsValidate=false;
                    return;
                  }
            });
          }
            else {
              this.MessageService.errormessage(this.translate.instant('UserMgmtProductSelectMsg'));
              this.FlagProduct=false;
              this.IsValidate=false;
              return;
            }
            elemntProduct="";
      }
  EmployeeValidation()
    {
      
      this.FlagEmployee=true;
      for(let i=0; i <this.SubmitSave.Product.length; i++)
         {
           if(this.SubmitSave.Product[i].EmployeeId==='' && this.SubmitSave.Product[i].bussPart==='' || this.SubmitSave.Product[i].EmployeeId===undefined)
             {
              this.MessageService.errormessage(this.translate.instant('EmployeeAndBPValidationmsg'));
              this.FlagEmployee=false;
              this.IsValidate=false;
              return;
             }
         }
    }    

  Validation()
   {
    this.IsValidate=true;
    let elmnt="";
    let elmntWorkCenter="";
    let elemntProduct="";
   for(let j=0; j<this.SubmitSave.Warehouse.length; j++)
       {
         elmnt = elmnt + ','+ this.SubmitSave.Warehouse[j].Company
       }
    // Work Center Company
     if(this.SubmitSave.WorkCenter.length>0)
       {
         for(let j=0; j<this.SubmitSave.WorkCenter.length; j++)
         {
         elmntWorkCenter = elmntWorkCenter + ','+ this.SubmitSave.WorkCenter[j].Company
         }
       }
  
      this.SubmitSave.Company.forEach((c, cindex) => {
      this.SubmitSave.Product.forEach((p, pindex) => {
        if(c.Company===p.Company)
         {
            this.FlagWC=true;
            this.FlagWH=true;
            let WhValidation="";
            let WCValidation="";
            let WhName="";
            let TempEmpName="";
            let WHTempValue="";
            let SelectedProduct=[];
            let array = [];
            let Localarray = [];
                 this.SubmitSave.Product.forEach((value, index) => {
                   if(value.Company === c.Company){
                     array.push( value.productCode );
                     Localarray.push( value.productCode );
                     TempEmpName=value.EmployeeId
                   }
                 });

           for(let i=0; i <this.ddlProductList.length; i++)
             {
               if(this.ddlProductList[i].ProductId===p.productCode)
               {
                 WhValidation=this.ddlProductList[i].OPTM_ISWHSEENABLED;
                  WCValidation=this.ddlProductList[i].OPTM_ISWRKCENTERENABLED;   
               }
             }
             // Warehouse validation
             if(WhValidation==="Y")
               {
                 if(this.SubmitSave.Warehouse.length>0)
                 {
                   for(let j=0; j <this.SubmitSave.Warehouse.length; j++)
                   {
                     if(elmnt.includes(c.Company))
                       {
                         if(this.SubmitSave.Warehouse[j].Id===null || this.SubmitSave.Warehouse[j].Id==="")
                         {
                          
                           this.MessageService.errormessage(this.translate.instant('UserMgmtWarehouseSelectMsg')+' '+c.Company);
                           this.FlagWH=false;
                           this.IsValidate=false;
                           return;
                         }
                         else {
                           WhName=this.SubmitSave.Warehouse[j].Id;
                         }
 
                       }
                       else {
                         this.MessageService.errormessage(this.translate.instant('UserMgmtWarehouseSelectMsg')+' '+c.Company);
                         this.FlagWH=false;
                         this.IsValidate=false;
                         return;
                       }}}
                 else {
                   
                   this.MessageService.errormessage(this.translate.instant('UserMgmtWarehouseSelectMsg')+' '+c.Company);
                   this.IsValidate=false;
                   this.FlagWH=false;
                   return;
                 } }

               if(WCValidation==="Y")
               {
                 if(this.SubmitSave.WorkCenter.length>0)
                 {
                   for(let j=0; j <this.SubmitSave.WorkCenter.length; j++)
                     {
                       if(elmntWorkCenter.includes(c.Company))
                         {
                           if(this.SubmitSave.WorkCenter[j].WorkCenterCode==="" && this.SubmitSave.WorkCenter[j].Company===c.Company )
                            {
                              this.MessageService.errormessage(this.translate.instant('UserMgmtWorkcenterSelectMsg')+' '+c.Company);
                              this.FlagWC=false;
                              this.IsValidate=false;
                              return;
                            }
                            else {
                              var TempAssignWareHouse=[];
                              let TempLocalVarCompany='';
                              TempLocalVarCompany=this.SubmitSave.WorkCenter[j].Company;
                              TempAssignWareHouse=this.SubmitSave.Warehouse;
                              if(this.SubmitSave.WorkCenter[j].Warehouse==="" && this.SubmitSave.WorkCenter[j].Company===c.Company )
                                {
                                  var TempData = TempAssignWareHouse.filter(function (el) {
                                    return el.Company == this.SubmitSave.WorkCenter[j].Company;
                                });
                                if(TempData.length>0)
                                 {
                                  this.SubmitSave.WorkCenter[j].Warehouse=TempData[0].Id;
                                 }}}}
                         else {
                           this.MessageService.errormessage(this.translate.instant('UserMgmtWorkcenterSelectMsg')+' '+c.Company);
                           this.FlagWC=false;
                           this.IsValidate=false;
                              return;
                         }} }
               else {
                 this.MessageService.errormessage(this.translate.instant('UserMgmtWorkcenterSelectMsg')+' '+c.Company);
                 this.FlagWC=false;
                 this.IsValidate=false;
                              return;
               }
               }}});});
            }
    CheckWorkCenterExist()
             {
              this.SubmitSave.Company.forEach((c, cindex) => {
                var filterWCRow = this.SubmitSave.WorkCenter.filter(function (el) {
                    return el.Company === c.Company ;
                });
                if(filterWCRow.length===0)
                    {
                      let TempEmpName="";
                      let Tempbusspart="";
                      let Singlearray = [];
                    
                           this.SubmitSave.Product.forEach((value, index) => {
                             if(value.Company === c.Company){
                              Singlearray.push(value.productCode);
                               if(value.EmployeeId!='')
                                {
                                  TempEmpName=value.EmployeeId
                                }
                                else {
                                  Tempbusspart=value.bussPart
                                }
                             
                            // }
                            }})
                            this.SubmitSave.WorkCenter.push({
                              Company: c.Company, EmployeeId: TempEmpName, 
                               productCode: Singlearray.toString(), WorkCenterCode: "",  Warehouse: "",
                               bussPart: Tempbusspart
                              });
                              TempEmpName='';
                              Tempbusspart='';
                    }
                  });

                 
             }

   CreaeWorkCenterForBlankWorkcenterSelection()
    {
      if(this.FlagEmployee===false) return;
      let TempelmntWorkCenter="";
      let TempWHName="";
       this.SubmitSave.Company.forEach((c, cindex) => {
         this.SubmitSave.Product.forEach((p, pindex) => {
          // this.FlagProduct=true;
           if(c.Company===p.Company)
              {
                    let TempWorkCenterElmnt="";
                    let TempWCCompany="";
                    for(let j=0; j<this.SubmitSave.WorkCenter.length; j++)
                     {
                      TempWorkCenterElmnt=TempWorkCenterElmnt+','+this.SubmitSave.WorkCenter[j].Warehouse
                      TempWCCompany=TempWCCompany+','+this.SubmitSave.WorkCenter[j].Company
                     }
                      if(this.SubmitSave.Warehouse.length>0)
                          {
                            for(let i=0; i<this.SubmitSave.Warehouse.length; i++)
                            {
                              let TempEmpName='';
                              let TempBussPart='';
                              let array = [];
                            
                                   this.SubmitSave.Product.forEach((value, index) => {
                                     if(value.Company === this.SubmitSave.Warehouse[i].Company){
                                       array.push( value.productCode );
                                       TempEmpName=value.EmployeeId
                                       TempBussPart=value.bussPart
                                     }})
                             
                                if(TempWorkCenterElmnt.includes(this.SubmitSave.Warehouse[i].Id) && TempWCCompany.includes(this.SubmitSave.Warehouse[i].Company))
                                  {}
                                  else {
                                    this.SubmitSave.WorkCenter.push({
                                      Company: this.SubmitSave.Warehouse[i].Company, EmployeeId: TempEmpName, 
                                       productCode: array.toString(), WorkCenterCode: "",  Warehouse: this.SubmitSave.Warehouse[i].Id,
                                       bussPart: TempBussPart
                                       //TempEmpName="";
                                   })
                                   TempWorkCenterElmnt=TempWorkCenterElmnt+','+this.SubmitSave.Warehouse[i].Id
                                   TempEmpName='';
                                   TempBussPart='';

                                  }}
                          }
                          else {
                          
                            let TempEmpName="";
                            let Tempbusspart="";
                            let array = [];
                          
                                 this.SubmitSave.Product.forEach((value, index) => {
                                   if(value.Company === c.Company){
                                     array.push( value.productCode );
                                     if(value.EmployeeId!='')
                                      {
                                        TempEmpName=value.EmployeeId
                                      }
                                      else {
                                        Tempbusspart=value.bussPart
                                      }
                                   
                                  // }
                                  }})

                                  if(this.SubmitSave.WorkCenter.length>0)
                                      {
                                          for(let i=0; i< this.SubmitSave.WorkCenter.length; i++)
                                            {
                                              if(TempWCCompany.includes(this.SubmitSave.WorkCenter[i].Company))
                                               {}
                                               else
                                                {
                                                  this.SubmitSave.WorkCenter.push({
                                                    Company: c.Company, EmployeeId: TempEmpName, 
                                                     productCode: array.toString(), WorkCenterCode: "",  Warehouse: "",
                                                     bussPart: Tempbusspart
                                                    })
                                                    TempWCCompany=TempWCCompany+','+this.SubmitSave.WorkCenter[i].Company
                                                }
                                            }
                                      }
                                   else {
                                    this.SubmitSave.WorkCenter.push({
                                      Company: c.Company, EmployeeId: TempEmpName, 
                                       productCode: array.toString(), WorkCenterCode: "",  Warehouse: "",
                                       bussPart: Tempbusspart
                                      })
                                   }
                          }
                     
                            } }) });}

    ClearSelection()
      {
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
            this.SubmitSave.EmployeeId =[];
            this.SubmitSave.Company = [];
            this.SubmitSave.Product = [];
            this.SubmitSave.Warehouse = [];
            this.SubmitSave.WorkCenter = [];
            this.SubmitSave.Values = [];
            this.SubmitSave.PreviousUserId = [];
            this.company_data=[];
            this.WH_WC_Data=[];
            this.tenant='';
            this.BPID='';
            //this.SubmitSave='';
            this.FlagProduct=true;
            this.FlagWC=true;
            this.FlagWH=true;
            this.FlagEmployee=true;
            this.IsEditMode=false;
            this.dbClickUserType='';
            this.getUserList();
            this.FillCompNGrpNSAPUsrNProd();
          
            
            // this.addUserScreenToggle();
      }

  saveRecord(mode){
    
  
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
   this.EmployeeValidation();
    this.Validation();
    this.ProductValidation();
    
     if(this.IsValidate===true)
        {this.CreaeWorkCenterForBlankWorkcenterSelection();
        }
        else {
          this.Loading=false;
          return;

        }
    
    
    if(this.FlagWC===true && this.FlagWH===true && this.FlagProduct===true && this.FlagEmployee===true) 
      {
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
        this.CheckWorkCenterExist();
      }
      else {

        this.MessageService.errormessage(this.translate.instant('UserMgmtCheckSelectionMsg'));
        return;
      }
    this.Loading = false; 
    if(mode == 'add'){
     
        this.Loading = true; 
        this.UserManagementService.AddUserManagement(this.SubmitSave).subscribe(
          data => {
           
          if(data=="True")
            {
              this.Loading = false; 
              this.MessageService.successmessage(this.translate.instant('UserMgmtInsertSuccessMsg'));
              this.ClearSelection();
              this.FillCompNGrpNSAPUsrNProd();
            }
            else{
              this.MessageService.errormessage(data);
              this.Loading = false; 
            }
            
          },    
          error => {  
            this.Loading = false; 
            //this.MessageService.errormessage(error.message);
            if(error.error != null && error.error != undefined){
              if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
                this.commonService.unauthorizedToken(error);               
              }
             }
            else{
              this.MessageService.errormessage(error.message);
            }
        });
      }else{
        this.Loading = true; 
        this.UserManagementService.EditUserManagement(this.SubmitSave).subscribe(
          data => {
            if(data=="True")
            {
              this.MessageService.successmessage(this.translate.instant('UserMgmtUpdateSuccessMsg'));
              this.ClearSelection();
              this.FillCompNGrpNSAPUsrNProd();
            }
            else {
              this.MessageService.errormessage(data);
              this.Loading = false; 
            }
          },    
          error => {
            this.Loading = false;   
            //this.MessageService.errormessage(error.message);
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
    this.IsEditMode=true;
    //this.SubmitSave.Warehouse=[];
    var wc=[];
    this.SubmitSave.EmployeeId =[];
    this.SubmitSave.Company = [];
    this.SubmitSave.Product = [];
    this.SubmitSave.Warehouse = [];
    this.SubmitSave.WorkCenter = [];
    this.SubmitSave.Values = [];
    this.SubmitSave.PreviousUserId = [];
    this.EmpID=[]
     this.Loading=true;
    this.UserManagementService.getEditDetail(userId).subscribe(    
      data => { 

        this.editUserData = data;
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
          this.dbClickUserType=data[0].OPTM_USERTYPE
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
              WorkCenter.push({
                Company: element2.OPTM_COMPID,
                WorkCenterCode: element2.OPTM_WORKCENTER,
                Warehouse: element2.OPTM_WHSE,
                productCode: element2.OPTM_OPTIADDON,
                EmployeeId: element2.OPTM_EMPID,
                bussPart:element2.OPTM_BPCODE
        })
        this.SubmitSave.WorkCenter=WorkCenter;
         if(element2.OPTM_WHSE !='' && element2.OPTM_WHSE!=undefined && element2.OPTM_WHSE !=null){
          Warehouse.push({
            Id: element2.OPTM_WHSE,
             Company: element2.OPTM_COMPID,
             EmployeeId: element2.OPTM_EMPID,
             bussPart:element2.OPTM_BPCODE
          })

      }
      
      let empID="";
      let BPID="";
      let Val="";
      //this.FillEmployee("",index,this.company_data);
       if(element2.OPTM_USERTYPE==="C" || element2.OPTM_USERTYPE==="V")
          {
            Val=element2.OPTM_USERTYPE;
          }
      this.UserManagementService.FillDDlEmployee(element2.OPTM_COMPID,Val).subscribe(
        employeedata => {
          //this.Loading = false;
          this.employeeData = employeedata;
          //data.CompanyList[i]["UserType"] = this.ddlUserType;
          if(Val==="")
            {
              this.company_data[index]["Employee"] = employeedata;
              empID = this.company_data[index].Employee.filter(i => i.empID == element2.OPTM_EMPID);
             this.company_data[index]["selectedEmployeeType"] = empID[0];
            }
            else {
              this.company_data[index]["listItems"]= employeedata;
              BPID = this.company_data[index].listItems.filter(i => i.CardCode == element2.OPTM_BPCODE);
             this.company_data[index]["selectedBP"] = BPID[0];
            }
          

          this.SubmitSave.Warehouse= Warehouse;    
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

          this.SubmitSave.EmployeeId.push({Company: this.company_data[index].dbName, 
            empID: this.company_data[index].selectedEmployeeType.empID,
            bussPart:  this.company_data[index].selectedBP.CardCode, eIndex: index});
            
          this.SubmitSave.EmployeeId = this.removeDuplicatesValue(this.SubmitSave.EmployeeId, 'Company');
          
          this.company_data[index]["selectedCompany"] = element2.OPTM_COMPID;
          
          if(element2.OPTM_OPTIADDON!=null && element2.OPTM_OPTIADDON!=''){
            let productSplitArray = element2.OPTM_OPTIADDON.includes(',')? element2.OPTM_OPTIADDON.split(','):[element2.OPTM_OPTIADDON];
            for(let j=0; j<productSplitArray.length; j++){
              let productUniqueID = this.company_data[index].product.filter(i => i.ProductId == productSplitArray[j]);
            
              if(productUniqueID.length>0){
                this.productSelection.push(productUniqueID[0].UniqueId);

                this.SubmitSave.Product.push({productCode: productSplitArray[j], pIndex: index, 
                  bussPart:  element2.OPTM_BPCODE,
                  Company: this.company_data[index].dbName, EmployeeId: element2.OPTM_EMPID});
//pIndex
                //this.SubmitSave.Product = this.removeDuplicatesValue(this.SubmitSave.Product, 'productCode');
              // this.SubmitSave.Product = this.removeDuplicatesValue(this.SubmitSave.Product, 'pIndex');
              this.SubmitSave.Product = this.SubmitSave.Product.filter((thing, index, self) =>
              index === self.findIndex((t) => (
              t.Company === thing.Company && t.productCode === thing.productCode && t.EmployeeId===thing.EmployeeId
            ))
          )
                }
              }
          }
         
        },error => {
          //this.MessageService.errormessage(error.message); 
          this.Loading=false;
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
             /*-- get warehouse and workcenter list --*/
          });  
        });
    }, error => {
      this.Loading = false;    
      if(error.error != null && error.error != undefined){
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
       }
      else{
        this.MessageService.errormessage(error.message);
      }
      //this.MessageService.errormessage(error.message);   
    });    
  }
 
  onBlurUserID() {
      this.UserManagementService.CheckDuplicateUserGroup(this.user_id).subscribe(    
        data => { 
          if(data.length > 0){
            if(data[0].UserCodeCount>0){
              this.MessageService.errormessage(this.translate.instant('UserMgmtExistUserIdMsg'))
            }else{
            }  
          }    
          else{    
            this.MessageService.errormessage(this.translate.instant('UserMgmtSomethimgWntWrngMsg'));
          }    
        },    
        error => {
          //this.MessageService.errormessage(error.message); 
          this.Loading=false;
          if(error.error != null && error.error != undefined){
            if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
              this.commonService.unauthorizedToken(error);               
            }
           }
          else{
            this.MessageService.errormessage(error.message);
          }
        });
  };

  public confirmationToggle() {
    this.confirmationOpened = !this.confirmationOpened;
  }

  userRefrenceCheck(mode){
    this.confirmationOpened=false;
    this.confirmationOpenedEdit = false;
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
        this.Loading=false;
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
  
  deleteRecord(){
    this.Loading=true;
    
    this.UserManagementService.DeleteUserManagement(this.userId).subscribe(    
      data => { 
        this.Loading = false;   
        this.MessageService.successmessage(this.translate.instant('UserMgmtDeleteSuccessMsg'));
        this.ClearSelection();
        //this.addUserScreen = !this.addUserScreen; 
        //this.getUserList();
      },    
      error => {
        this.Loading = false;  
        //this.MessageService.errormessage(error.message); 
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

  onChange(e){
    this.Loading=true;
    var UserGrpId=[{"UserGroupId": e.groupCode}];
    this.UserManagementService.GetSAPUserByGrpId(UserGrpId).subscribe(    
      data => { 
        this.Loading=false;
        if(data.length>0)
        {
          this.mapped_user = {USER_CODE: data[0].OPTM_SAPUSER};
          this.mappedPass=data[0].OPTM_SAPPASSWORD;
        }
      },    
      error => {
        //this.MessageService.errormessage(error.message); 
        this.Loading=false;
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

  cancelConfirm(){
    if(this.addscreenmode == 'edit'){
      this.confirmationOpenedEdit = true;     
      //this.confirmationEditToggle();      
    }
    else{      
      this.cancel();
    }
  }
  
  cancel(){    
    this.confirmationOpenedEdit = false;  
    this.ClearSelection();
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

  setCustomValidity() {
     
    if (this.password != this.re_password) {
      this.IsComparePassword=false
       // input.setCustomValidity('Password Must be Matching.');
    } else {
      this.IsComparePassword=true;
    }
}
  
  
}
