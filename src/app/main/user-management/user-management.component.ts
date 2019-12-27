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
  public isColumnFilter:boolean=false;
  public isColumnFilter14:boolean=false;
  public isColumnFilter33:boolean=false;
  
  public SingleCompSelection:boolean=false;
  public SingleProductSelection:boolean=false;
  public SingleWHSelection:boolean=false;
  public SingleWCSelection:boolean=false;
  
  
  public IsCustomeVendorSelected:boolean=false;
  
  public IsEditMode:boolean=false;
  public IsEditWorkcenter:boolean=false;
  public showGridUserMgmtPage: boolean = false;
  public confirmationOpenedEdit = false; 
  public IsUpdateForCheck :boolean = false;
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
    this.EmpID='';
    this.BPID='';
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
          if(error.error == "401"){
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
    this.accountStatus = true; 
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
              products[j]["SingleProductSelection"]=false;       
            }
            element["product"] = products;
            data.CompanyList[i]["UserType"] = this.ddlUserType;
            //data.CompanyList[i]["Employee"] = employeedata;
            data.CompanyList[i]["selectedEmployeeType"] = {empID: '', MergrEmpName: "--Select--"};
            data.CompanyList[i]["selectedBP"] = {CardCode: '', CardName: "--Select--"};
            data.CompanyList[i]["selectedUserType"] = { text: "Employee", value: 'E' };
            data.CompanyList[i]["selectedCompany"] = 'blank';
            data.CompanyList[i]["SingleCompSelection"] = false;

           // this.SingleCompSelection[index].checked
            this.company_data = data.CompanyList;
            this.Loading = false;
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
          if(error.error == "401"){
            this.commonService.unauthorizedToken(error);               
          }
         }
        else{
          this.MessageService.errormessage(error.message);
        }  
      });
  }
   //Get Employee Data
   FillEmployee(CPdata)
     {
      // alert(index);
       this.Loading=true;
      // let DatabaseName=CPdata[index].dbName;
      let DatabaseName=CPdata

       this.UserManagementService.FillDDlEmployee(DatabaseName,"").subscribe(
        employeedata => {
          this.Loading = false;
          this.employeeData = employeedata;
          if(employeedata !=null && employeedata !='')
            {
              for(let i=0; i <employeedata.length; i++)
              {
                //this.employeeData[i]["MergrEmpName"] = employeedata[i].firstName+'   '+employeedata[i].empID;
                this.employeeData[i]["MergrEmpName"] =employeedata[i].empID +'   '+employeedata[i].firstName;
              }
          var findex =this.company_data.findIndex(function (x) { return x.dbName == DatabaseName });
          //data.CompanyList[i]["UserType"] = this.ddlUserType;
          this.company_data[findex]["Employee"] = employeedata;
            }
        },  error => {    
          //this.MessageService.errormessage(error.message);
          this.Loading=false;
          if(error.error != null && error.error != undefined){
            if(error.error == "401"){
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
     //let DatabaseName=CPdata[index].dbName;
     let DatabaseName=this.dbName;
    this.UserManagementService.FillDDlEmployee(DatabaseName,e.value).subscribe(
      BPData => {
        this.Loading = false;
        if(BPData !=null && BPData !='')
            {
              this.BPData = BPData;
              //data.CompanyList[i]["UserType"] = this.ddlUserType;
             // this.company_data[index]["listItems"] = BPData;
             var findex =this.company_data.findIndex(function (x) { return x.dbName == DatabaseName });
             //data.CompanyList[i]["UserType"] = this.ddlUserType;
             this.company_data[findex]["listItems"] = BPData;
            }
      },
      error => {    
        //this.MessageService.errormessage(error.message);
        this.Loading=false;
        if(error.error != null && error.error != undefined){
          if(error.error == "401"){
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

    if(this.IsEditMode)this.IsUpdateForCheck=true;
    if(e.value==="C" || e.value==="V")
     {
      this.FillBusinessPartnerData(e, index, CPdata)
     }
    this.BindProductWithCompany(e.value,index);
    this.userType = e.value;
  }
  BindProductWithCompany(ProductValue,index)
     {
      const element = this.company_data[index];
      let products = JSON.parse(JSON.stringify(this.ddlProductList));
      for (let j = 0; j < products.length; j++) {      
        products[j]["UniqueId"] = index+''+j;
        products[j]["SingleProductSelection"] = false;  
              
      }
      element["product"] = products;
      if(ProductValue === 'C'){
        let productByStoreID = element.product.filter(product => product.ProductId === 'CVP');
        this.company_data[index]["product"] = productByStoreID;
        this.company_data[index]["BPCode"] = true;
      }
      if(ProductValue === 'V'){
        let productByStoreID = element.product.filter(product => product.ProductId === 'CVP' 
        ||  product.ProductId === 'MMO');
        this.company_data[index]["product"] = productByStoreID;
        this.company_data[index]["BPCode"] = true;
      }
  
      if(ProductValue === 'E'){
        let productByStoreID = element.product.filter(product => product.ProductId != 'CVP');
        this.company_data[index]["product"] = productByStoreID;
        this.company_data[index]["BPCode"] = false;
      }
     }
  /*-- get warehouse and workcenter list --*/
  FillDDlWarehouse(dbName, index){
    //this.WH_WC_Data=[];
    //this.Loading = true;
    this.gridRefresh = false;
    let TmpDbName='';
    let tempIndx;
    this.UserManagementService.FillDDlWarehouse(dbName, '').subscribe(
      warehousedata => {
        if(warehousedata !=null && warehousedata !='')
             {
              for(let i=0;i<warehousedata.Table.length; i++){
                warehousedata.Table[i]["uniqueId"] = index+''+i;
                warehousedata.Table[i]["SingleWHSelection"] = false;
                    TmpDbName=this.dbName;
                    if(this.SubmitSave.Warehouse.length>0)
                      {
                        let TmpWHId='';
                        for(let m=0; m <this.SubmitSave.Warehouse.length; m++)
                          {
                            TmpWHId=this.SubmitSave.Warehouse[m].Id;
                            if(this.SubmitSave.Warehouse[m].Company===TmpDbName 
                              && warehousedata.Table[i].OPTM_WHSE===this.SubmitSave.Warehouse[m].Id)
                               {
                                warehousedata.Table[i].SingleWHSelection=true;
                               }
                          }
                      }
                 // }
                
                 this.WHGetSelectiondata(warehousedata.Table[i], i); 
                this.UserManagementService.FillDDlWorkCenter(dbName, warehousedata.Table[i].OPTM_WHSE).subscribe(
                  WorkCenterdata => {
                    this.Loading = false;
                    warehousedata.Table[i]["workcenter"] = WorkCenterdata;
                   //this.delay(5000).then(any=>{
                     if(warehousedata.Table[i].workcenter !=null && warehousedata.Table[i].workcenter !=undefined)
                       {
                        if(warehousedata.Table[i].workcenter.length>0){
                          for (let j = 0; j < warehousedata.Table[i].workcenter.length; j++) {      
                            warehousedata.Table[i].workcenter[j]["uniqueId"] = dbName+''+i+''+j;
                            warehousedata.Table[i].workcenter[j]["SingleWCSelection"] = false;
                           let tempdb='';
                           tempdb=this.dbName;
                           var TempWCFilter;
                              if(this.SubmitSave.WorkCenter.length>0)
                              {
                                 TempWCFilter = this.SubmitSave.WorkCenter.filter(function (el) {
                                  return el.Company == tempdb && el.Warehouse===warehousedata.Table[i].OPTM_WHSE
                                     && el.WorkCenterCode===warehousedata.Table[i].workcenter[j].WorkCenterCode;
                              });
                            if( TempWCFilter.length>0)
                              {
                                
                                warehousedata.Table[i].SingleWHSelection=true;
                                warehousedata.Table[i].workcenter[j]["SingleWCSelection"] = true;
                              }
                               
                              }
                             
                            this.WCGetSelectiondata(warehousedata.Table[i].workcenter[j], i);      
                           }
                        }
                       }
                  },
                 
            error => {    
              //this.MessageService.errormessage(error.message);
              this.Loading=false;
              if(error.error != null && error.error != undefined){
                this.Loading=false;
                if(error.error == "401"){
                  this.commonService.unauthorizedToken(error);               
                }
               }
              else{
                this.Loading=false;
                this.MessageService.errormessage(error.message);
              }
            });  
                }
                this.WH_WC_Data = warehousedata.Table;
             }
        
         
       
      },
      error => {    
        //this.MessageService.errormessage(error.message);
        this.Loading=false;
        if(error.error != null && error.error != undefined){
          if(error.error == "401"){
            this.commonService.unauthorizedToken(error);               
          }
         }
        else{
          this.MessageService.errormessage(error.message);
        }
      });  
  } 

  WHGetSelectiondata(WHData, WHIndex){
    
    if(this.IsEditMode===true)
     {if(this.editUserData.length>0){
      //onsole.log(this.editUserData)
    //  this.company_data.forEach((element, index) => {
        this.editUserData.forEach((element2, index2) => {
          
          //if(element.dbName === element2.OPTM_COMPID){
            if(this.ShowDBName === element2.OPTM_COMPID){
            if(WHData.OPTM_WHSE === element2.OPTM_WHSE){
            
              this.SubmitSave.Warehouse.push({Company: element2.OPTM_COMPID, Id: element2.OPTM_WHSE, 
                EmployeeId: element2.OPTM_EMPID, 
                WHIndex: WHIndex,  bussPart:element2.OPTM_BPCODE});
                this.SubmitSave.Warehouse = this.SubmitSave.Warehouse.filter((thing, index, self) =>
              index === self.findIndex((t) => (
              t.Company === thing.Company && t.Id === thing.Id && t.EmployeeId===thing.EmployeeId
            )))
            this.warehouseSelection.push(WHData.uniqueId);
            
             // this.SubmitSave.Warehouse = this.removeDuplicatesValue(this.SubmitSave.Warehouse, 'Id');
            
              
            }
          }
        });  
    //  });
    }}
    
  }

  WCGetSelectiondata(WCData, WCIndex){
    if(this.IsEditMode===true)
    {
      if(this.editUserData.length>0){
        //this.company_data.forEach((element, index) => {
          this.editUserData.forEach((element2, index2) => {
          
            //if(element.dbName === element2.OPTM_COMPID){
              if(this.ShowDBName === element2.OPTM_COMPID){
              if(WCData.WorkCenterCode === element2.OPTM_WORKCENTER && element2.OPTM_WHSE != ""){
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
      else {
        this.dbClickEmployeeName = e.dataItem.selectedEmployeeType.empID;
        this.EmpID = e.dataItem.selectedEmployeeType.empID;
      }
      // if(e.dataItem.selectedEmployeeType){
      //   this.dbClickEmployeeName = e.dataItem.selectedEmployeeType.empID;
      //   this.EmpID = e.dataItem.selectedEmployeeType.empID;
      // }
     if(this.IsEditMode===false)this.CheckIfProductIsChecked(e)
      this.FillDDlWarehouse(e.dataItem.dbName, e.rowIndex);
  } 
  CheckIfProductIsChecked(e)
   {
    if(this.SubmitSave.Product.length>0)
    {
      for(let i=0; i <this.SubmitSave.Product.length; i++)
      {
      if(this.SubmitSave.Product[i].Company===e.dataItem.dbName)
         {
           let TempProduct=this.SubmitSave.Product[i].productCode;
           var index = e.dataItem.product.findIndex(function (x)
                { 
                  return x.ProductId == TempProduct 
                })
          e.dataItem.product[index].SingleProductSelection=true;
         }
      }
    }
   }
  onExpandCompany(event){
    
   
    if(event.dataItem.selectedCompany == 'blank'){
      this.MessageService.errormessage(this.translate.instant('UserMgmtCompanySelectMsg')); 
    }
    if(event.dataItem.selectedUserType.value==="")this.MessageService.errormessage(this.translate.instant('UserTypeValidationmsg')); 
    if(event.dataItem.selectedUserType.value==="E")
    {
      if(event.dataItem.selectedEmployeeType.empID===""){}
      //this.MessageService.errormessage(this.translate.instant('EmployeeValidationmsg')); 
    }
    else {
      if(event.dataItem.selectedBP.CardCode!="" && event.dataItem.selectedBP.CardCode !=null){
       this.IsCustomeVendorSelected=true;
      }
      //this.MessageService.errormessage(this.translate.instant('BPCodeValidationmsg')); 
    }
    if(this.IsEditMode===false)
     { 
       this.CheckIfProductIsChecked(event)
      }
   
  }

  onExpandWarehouse(event){
    /*if(event.dataItem.selectedWarehouse == 'blank'){
      this.MessageService.errormessage("please choose Warehouse"); 
    }*/
  }
 
  companySelect(event: any, companyData, companyIndex){

    if(this.IsEditMode)this.IsUpdateForCheck=true;
    this.FillEmployee (companyData.dbName)
    var index = this.company_data.findIndex(function (x) { return x.dbName == companyData.dbName });
    
    if(event.target.checked === true){
      if(index>0)
      this.BindProductWithCompany(companyData.selectedUserType.value,index)
      this.company_data[index]["selectedCompany"] = companyData.dbName;     
    }else{
      this.company_data[index]["selectedCompany"] = 'blank';
    }
    if(event.target.checked === true){
      this.SubmitSave.Company.push({Company: companyData.dbName, cIndex: companyIndex});            
    }else{
      this.RemoveDataOnCompanyUncheck(companyData);
      companyData.selectedEmployeeType.empID='';
      companyData.selectedEmployeeType.MergrEmpName='--Select--';
      companyData.selectedEmployeeType.firstName='--Select--';
      companyData.selectedBP.CardCode='';
      companyData.selectedBP.CardName=='--Select--';
      this.dbName = '';
      this.ShowDBName='';
      this.ShowCompanyName='';
      
    } 
  }
  RemoveDataOnCompanyUncheck(companyData)
    {
      this.SubmitSave.Company = this.SubmitSave.Company.filter(function (el) {
        return el.Company != companyData.dbName;
    });
        this.SubmitSave.WorkCenter = this.SubmitSave.WorkCenter.filter(function (el) {
          return el.Company != companyData.dbName;
      });
      this.SubmitSave.Warehouse = this.SubmitSave.Warehouse.filter(function (el) {
        return el.Company != companyData.dbName;
    });
    this.SubmitSave.Product = this.SubmitSave.Product.filter(function (el) {
      return el.Company != companyData.dbName;
  });
      this.SubmitSave.EmployeeId = this.SubmitSave.EmployeeId.filter(function (el) {
        return el.Company != companyData.dbName;
    });
    
    }

  productSelect(event: any, product, productIndex, rowIndex){
    
    let EmployeeCheck='';
    if(this.IsCustomeVendorSelected===false)
        {
          if(this.SubmitSave.EmployeeId.length===0)
          {
            this.MessageService.errormessage(this.translate.instant('EmployeeAndBPValidationmsg'));
            event.target.checked=false; 
            return
          }
          else {
            let DatabaseName=this.dbName;
            EmployeeCheck = this.SubmitSave.EmployeeId.filter(function (el) {
              return el.Company == DatabaseName;
          });
          if(EmployeeCheck.length==0){
            this.MessageService.errormessage(this.translate.instant('EmployeeValidationmsg')); 
            event.target.checked=false;
            return
          }
          
          }
        }
    
    if(event.target.checked === true){
      this.productID = product;
      var TmpProduct =this.ddlProductList;
       var  FilterTmpProduct= TmpProduct.filter(function (el) {
          return el.ProductId == product;
      });
          this.SubmitSave.Product.push({productCode: this.productID, pIndex: rowIndex, bussPart: this.BPID,
          ISWHEnable: FilterTmpProduct[0].OPTM_ISWHSEENABLED, ISWCEnable:FilterTmpProduct[0].OPTM_ISWRKCENTERENABLED,
          Company:this.dbName });
    }else{
      // let whatIndexTwo = null;
      // this.SubmitSave.Product.forEach((value, index) => {
      //   if(value.productCode === product && value.Company===this.dbName){
      //       whatIndexTwo = index;
      //   }
      // }); 
      let Database=this.dbName;
      var findex =this.SubmitSave.Product.findIndex(function (x) 
        { 
          return x.productCode === product && x.Company==Database
        });
      this.SubmitSave.Product.splice(findex, 1);    
    }

    // this.SubmitSave.Company.forEach((c, cindex) => {
    //   this.SubmitSave.Product.forEach((p, pindex) => {
    //     if(c.cIndex === p.pIndex){
    //        this.SubmitSave.Product[pindex]["Company"] =  c.Company;
    //     }
    //   });
    // });

    this.SubmitSave.EmployeeId.forEach((e, eindex) => {
      this.SubmitSave.Product.forEach((p, pindex) => {
        if(e.eIndex === p.pIndex){
           this.SubmitSave.Product[pindex]["EmployeeId"] =  e.empID;
        }
      });
    });
    this.SubmitSave.Product = this.SubmitSave.Product.filter((thing, index, self) =>
    index === self.findIndex((t) => (
    t.Company === thing.Company && t.productCode === thing.productCode && t.EmployeeId===thing.EmployeeId
  ))
)
    let array = [];
     for(let i=0; i <this.SubmitSave.Product.length; i++ )
        {
          if(this.dbName===this.SubmitSave.Product[i].Company)
          array.push( this.SubmitSave.Product[i].productCode );
        }
      // this.SubmitSave.Product.forEach((value, index) => {
      //   if(value.pIndex === rowIndex){
      //     array.push( value.productCode );
      //   }
      // });
      this.dbClickProductName = array.toString();
      if(this.SubmitSave.WorkCenter.length>0)
        {
          for(let i=0; i <this.SubmitSave.WorkCenter.length; i++)
          {
           if(this.dbName===this.SubmitSave.WorkCenter[i].Company)
             {
               this.SubmitSave.WorkCenter[i].productCode=this.dbClickProductName;
             }
          }
        }
       if(this.IsEditMode===true)
           {
                 this.IsUpdateForCheck=true;
           }
  }

  warehouseSelect(event, warehouseData, warehouseIndex){
    if(this.IsEditMode)
     {
     this.IsUpdateForCheck=true;
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
    let TempDBName='';
    TempDBName=this.dbName;
    var ProductCheck = this.SubmitSave.Product.filter(function (el) {
      return el.Company == TempDBName;
  });
  
    if(event.target.checked === true){
      this.WH_WC_Data[warehouseIndex]["selectedWarehouse"] = warehouseData.OPTM_WHSE;
      this.WH_WC_Data[warehouseIndex]["SingleWHSelection"] = true;
      if(ProductCheck.length===0)
      {
        this.MessageService.errormessage(this.translate.instant('UserMgmtProductSelectMsg'));
        this.WH_WC_Data[warehouseIndex]["SingleWHSelection"] = false;
        event.target.checked=false;
        return;
      }
      
      }else{
        this.WH_WC_Data[warehouseIndex]["SingleWHSelection"] = false;
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
      //Removeing warehouse name from workcenter array if user deselect option at the time of edit
      for(let j=0; j <this.SubmitSave.WorkCenter.length; j++ )
          {
            if(this.SubmitSave.WorkCenter[j].Warehouse==warehouseData.OPTM_WHSE)
              {
                this.SubmitSave.WorkCenter.splice(j, 1); 
                //this.SubmitSave.WorkCenter[j].Warehouse="";
              }
          }
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
          if(this.SubmitSave.WorkCenter[i].WorkCenterCode ==="")
           {
            this.SubmitSave.WorkCenter[i].WorkCenterCode=workCenterData.WorkCenterCode;
            this.SubmitSave.WorkCenter[i].productCode=this.dbClickProductName;
            this.IsEditWorkcenter=true;
            return;
           }
         
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
          let TmpDbName='';
           TmpDbName=this.dbName;
            var WareHouseCheck = this.SubmitSave.Warehouse.filter(function (el) {
              return el.Company === TmpDbName && el.Id===workCenterData.Warehouse;
            });
            if(WareHouseCheck.length===0)
              {
                this.MessageService.errormessage(this.translate.instant('UserMgmtWarehouseSelectMsg'));
                event.target.checked=false;
                return;
              }
          this.IsEditWorkcenter=false;
          if(this.IsEditMode)
              { 
                this.IsUpdateForCheck=true;
              this.WorkCenterSelectEditMode(event, workCenterData, workCenterIndex);
            }
        if(this.IsEditWorkcenter===false)
         {
           
          if(event.target.checked === true){
            this.WCCode = workCenterData.WorkCenterCode;
            workCenterData.Warehouse
                this.SubmitSave.WorkCenter.push({Company: this.dbName, EmployeeId: this.EmpID, 
                  productCode: this.dbClickProductName,Warehouse:workCenterData.Warehouse ,WorkCenterCode: this.WCCode, WCIndex: workCenterIndex, 
                  bussPart: this.BPID});
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
    this.EmpID=e.empID;
    if(this.IsEditMode)this.IsUpdateForCheck=true;
    this.company_data[index]["selectedEmployeeType"] = e;
    this.SubmitSave.EmployeeId.push({Company: db, 
      empID: e.empID,
      bussPart:"", eIndex: index});
  }
  onChangeBPID(e, db, index)
   {
    
     this.BPID=e.CardCode;
    if(this.IsEditMode)this.IsUpdateForCheck=true;
    this.company_data[index]["selectedBP"] = e;
    this.SubmitSave.EmployeeId.push({Company: db, 
      empID: "",
      bussPart:e.CardCode, eIndex: index});
    
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
        this.MessageService.errormessage(this.translate.instant('UserMgmtProductSelectMsg'));
        this.FlagProduct=false;
        this.IsValidate=false;
        return;
      }
          
      if(this.SubmitSave.Product.length>0)
      {
        
            this.SubmitSave.Company.forEach((c, pindex) => {
            
                  if(elemntProduct.includes(c.Company))
                  {
                    this.FlagProduct=true;
                  }
                  else {
                    this.MessageService.errormessage(this.translate.instant('UserMgmtProductSelectMsg'));
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
  

  Validation()
   {
     
    this.IsValidate=true;
    let elmnt="";
    let elmntWorkCenter="";
    let elemntProduct="";
      this.SubmitSave.Company.forEach((c, cindex) => {
      this.SubmitSave.Product.forEach((p, pindex) => {
        if(c.Company===p.Company)
         {
            this.FlagWC=true;
            this.FlagWH=true;
            
             // Warehouse validation
             if(p.ISWHEnable==="Y")
               {
                var filterWareHouseValidation = this.SubmitSave.Warehouse.filter(function (el) {
                  return el.Company == c.Company;
              });
               if(filterWareHouseValidation.length===0)
                  {
                    this.MessageService.errormessage(this.translate.instant('UserMgmtWarehouseSelectMsg')+' '+c.Company);
                           this.FlagWH=false;
                           this.IsValidate=false;
                           return;
                  }
                
              }

               if(p.ISWCEnable==="Y")
                {
                  
                    if(this.SubmitSave.WorkCenter.length>0)
                       {
                        var filterWCRow = this.SubmitSave.WorkCenter.filter(function (el) {
                          return el.Company === p.Company && el.WorkCenterCode !="";
                      });
                      if(filterWCRow.length===0)
                           {
                            this.MessageService.errormessage(this.translate.instant('UserMgmtWorkcenterSelectMsg')+' '+c.Company);
                            this.FlagWC=false;
                            this.IsValidate=false;
                            return;
                           }
                       }
                       else{
                        this.MessageService.errormessage(this.translate.instant('UserMgmtWorkcenterSelectMsg')+' '+c.Company);
                        this.FlagWC=false;
                        this.IsValidate=false;
                        return;
                       }

                // for(let i=0; i <this.SubmitSave.WorkCenter.length; i ++)
                //     {
                //       if(this.SubmitSave.WorkCenter[i].Company===c.Company 
                //         && this.SubmitSave.WorkCenter[i].WorkCenterCode ==="" && p.Company !="")
                //         {
                          
                //         }
                //     }
                
                    }
                  }
                 
                  
                    });
                  });
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
                    // let TempWorkCenterElmnt="";
                    // let TempWCCompany="";
                    // for(let j=0; j<this.SubmitSave.WorkCenter.length; j++)
                    //  {
                    //   TempWorkCenterElmnt=TempWorkCenterElmnt+','+this.SubmitSave.WorkCenter[j].Warehouse
                    //   TempWCCompany=TempWCCompany+','+this.SubmitSave.WorkCenter[j].Company
                    //  }
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
                                     let TempWRName='';
                                     let TempWCName='';
                                     TempWRName=this.SubmitSave.Warehouse[i].Id;
                                     TempWCName=this.SubmitSave.Warehouse[i].Company;
                                  var filterWCData = this.SubmitSave.WorkCenter.filter(function (el) {
                                      return el.Company === TempWCName && el.Warehouse === TempWRName;
                                  });
                                // if(TempWorkCenterElmnt.includes(this.SubmitSave.Warehouse[i].Id) &&
                                //  TempWCCompany.includes(this.SubmitSave.Warehouse[i].Company))
                                if(filterWCData.length!=0)
                                  {}
                                  else {
                                    this.SubmitSave.WorkCenter.push({
                                      Company: this.SubmitSave.Warehouse[i].Company, EmployeeId: TempEmpName, 
                                       productCode: array.toString(), WorkCenterCode: "",  Warehouse: this.SubmitSave.Warehouse[i].Id,
                                       bussPart: TempBussPart
                                       //TempEmpName="";
                                   })
                                  // TempWorkCenterElmnt=TempWorkCenterElmnt+','+this.SubmitSave.Warehouse[i].Id
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
                                              let TempWRName='';
                                                let TempWCName='';
                                               // TempWRName=this.SubmitSave.Warehouse[i].Id;
                                                TempWCName=this.SubmitSave.WorkCenter[i].Company;
                                              var filterWCData = this.SubmitSave.WorkCenter.filter(function (el) {
                                                  return el.Company === TempWCName && el.Warehouse === TempWRName;
                                              });
                                              // if(TempWCCompany.includes(this.SubmitSave.WorkCenter[i].Company))
                                              if(filterWCData.lengt!=0)
                                               {}
                                               else
                                                {
                                                  this.SubmitSave.WorkCenter.push({
                                                    Company: c.Company, EmployeeId: TempEmpName, 
                                                     productCode: array.toString(), WorkCenterCode: "",  Warehouse: "",
                                                     bussPart: Tempbusspart
                                                    })
                                                    //TempWCCompany=TempWCCompany+','+this.SubmitSave.WorkCenter[i].Company
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
            this.dbName='';
            this.ShowDBName='';
            this.ShowCompanyName='';
            this.getUserList();
            this.FillCompNGrpNSAPUsrNProd();
           this.IsUpdateForCheck=false;
            
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
    this.ProductValidation();
   //this.EmployeeValidation();
    this.Validation();
    //
    
     if(this.IsValidate===true)
        {this.CreaeWorkCenterForBlankWorkcenterSelection();
        }
        else {
          this.Loading=false;
          return;

        }
    
    
    if(this.FlagWC===true && this.FlagWH===true && this.FlagProduct===true) 
      {
        this.SubmitSave.Values=[];
        this.SubmitSave.PreviousUserId=[];
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

        //this.MessageService.errormessage(this.translate.instant('UserMgmtCheckSelectionMsg'));
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
              if(error.error == "401"){
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
              this.confirmationOpenedEdit = false
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
              if(error.error == "401"){
                this.commonService.unauthorizedToken(error);               
              }
             }
            else{
              this.MessageService.errormessage(error.message);
            }
        });  
      }
  }
  IsUpdate()
  {
    if(this.IsEditMode)
    this.IsUpdateForCheck=true;
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
    var TempCompany=[];
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
    this.EmpID='';
     this.Loading=true;
    this.UserManagementService.getEditDetail(userId).subscribe(    
      data => { 
        if(data !=null && data !='')
            {
              for(let i=0; i <data.length; i++)
              {
                TempCompany.push({Company:data[i].OPTM_COMPID})
              }
              this.SetCompanyDataAtTop(TempCompany);
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
                  this.accountStatus = true;
                }else{
                  this.accountStatus = false;
                }  
              }
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
                
                if(employeedata !=null && employeedata !='')
                   {
                    if(Val==="")
                    {
                      for(let i=0; i <employeedata.length; i++)
                      {
                        this.employeeData[i]["MergrEmpName"] = employeedata[i].empID+'    '+employeedata[i].firstName;
                      }
                      this.company_data[index]["Employee"] = employeedata;
                      empID = this.company_data[index].Employee.filter(function (el) {
                        return el.empID == element2.OPTM_EMPID;
                    });
                      //empID = this.company_data[index].Employee.filter(i => i.empID == element2.OPTM_EMPID);
                      if(empID.length>0)
                     this.company_data[index]["selectedEmployeeType"] = empID[0];
                    }
                    else {
                      this.company_data[index]["listItems"]= employeedata;
                      BPID = this.company_data[index].listItems.filter(function (el) {
                        return el.CardCode == element2.OPTM_BPCODE;
                      });
                      //BPID = this.company_data[index].listItems.filter(i => i.CardCode == element2.OPTM_BPCODE);
                      if(BPID.length>0)
                     this.company_data[index]["selectedBP"] = BPID[0];
                    }
                   }
                //data.CompanyList[i]["UserType"] = this.ddlUserType;
                
                
      
                this.SubmitSave.Warehouse= Warehouse;    
                this.SubmitSave.Company.push({Company: this.company_data[index].dbName, cIndex: index}); 
               // this.SingleCompSelection[index].checked=true;
               this.company_data[index]["SingleCompSelection"] =true;
                this.SubmitSave.Company = this.removeDuplicatesValue(this.SubmitSave.Company, 'Company');
                
                this.companySelection.push(element2.OPTM_COMPID);
      
                const element = this.company_data[index];
                let products = JSON.parse(JSON.stringify(this.ddlProductList));
                for (let j = 0; j < products.length; j++) {      
                  products[j]["UniqueId"] = index+''+j; 
                  products[j]["SingleProductSelection"] =false;     
                }
             
                element["product"] = products;
      
                if(element2.OPTM_USERTYPE == 'C'){
                  this.company_data[index]["selectedUserType"] = { text: "Customer", value: element2.OPTM_USERTYPE };
      
                  let productByStoreID = element.product.filter(product => product.ProductId === 'CVP');
                  this.company_data[index]["product"] = productByStoreID;
                  this.company_data[index]["BPCode"] = true;
      
                }else if(element2.OPTM_USERTYPE == 'E'){
                  this.company_data[index]["selectedUserType"] = { text: "Employee", value: element2.OPTM_USERTYPE };
      
                  // let productByStoreID = element.product.filter(product => product.ProductId === 'ATD' 
                  // ||  product.ProductId === 'SFES' || product.ProductId === 'WMS' || product.ProductId === 'CNF'
                  // ||  product.ProductId === 'MMO' || product.ProductId === 'DSB');
                  let productByStoreID = element.product.filter(product => product.ProductId != 'CVP');
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
                   
                      productUniqueID[0].SingleProductSelection=true;
                      var TmpProduct =this.ddlProductList;
                      let TmpProductName='';
                       TmpProductName=productSplitArray[j]
                        var  FilterTmpProduct= TmpProduct.filter(function (el) {
                            return el.ProductId == TmpProductName;
                        });
                      this.SubmitSave.Product.push({productCode: productSplitArray[j], pIndex: index, 
                        bussPart:  element2.OPTM_BPCODE,
                        Company: this.company_data[index].dbName, EmployeeId: element2.OPTM_EMPID,
                        ISWHEnable: FilterTmpProduct[0].OPTM_ISWHSEENABLED, ISWCEnable:FilterTmpProduct[0].OPTM_ISWRKCENTERENABLED});
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
                  if(error.error == "401"){
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
              })
              
            this.dbClickUserType=this.company_data[0].selectedUserType.value
            this.BPID=this.company_data[0].selectedBP.CardCode; 
            this.EmpID = this.company_data[0].selectedEmployeeType.empID;
            this.dbClickEmployeeName=this.company_data[0].selectedEmployeeType.empID;
            this.ShowCompanyName=this.company_data[0].cmpName
            this.dbName=this.company_data[0].dbName;
            this.ShowDBName=this.company_data[0].dbName;
            this.FillDDlWarehouse(this.company_data[0].dbName,0);
            }
    }, error => {
      this.Loading = false;    
      if(error.error != null && error.error != undefined){
        if(error.error == "401"){
          this.commonService.unauthorizedToken(error);               
        }
       }
      else{
        this.MessageService.errormessage(error.message);
      }
      //this.MessageService.errormessage(error.message);   
    });    
  }
 
  SetCompanyDataAtTop(TempCompany) {
    var array=this.company_data;
    TempCompany.forEach(function (CompanySaved) {
      var index = array.findIndex(function (x) { return x.dbName == CompanySaved.Company });
      if (index >= 0) {
          var tempCompany = array[index];
          array.splice(index, 1);
          array.splice(0, 0, tempCompany);
      }
  });
  this.company_data=[];
  this.company_data=array;
  }
  
  onBlurUserID() {
    if(this.IsEditMode)this.IsUpdateForCheck=true;
      this.UserManagementService.CheckDuplicateUserGroup(this.user_id).subscribe(    
        data => { 
          if(data.length > 0){
            if(data[0].UserCodeCount>0){
              this.MessageService.errormessage(this.translate.instant('UserMgmtExistUserIdMsg'))
              this.user_id='';
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
            if(error.error == "401"){
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
         }
         else{
          this.MessageService.errormessage(this.translate.instant('CantDelete'));
          this.Loading=false;
         }
      },    
      error => {
        //console.log('e')
        this.Loading=false;
        if(error.error != null && error.error != undefined){
          if(error.error == "401"){
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
          if(error.error == "401"){
            this.commonService.unauthorizedToken(error);               
          }
         }
        else{
          this.MessageService.errormessage(error.message);
        }
      });
  }

  onChange(e){
    if(this.IsEditMode)this.IsUpdateForCheck=true;
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
          if(error.error == "401"){
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
      if(this.IsUpdateForCheck)
      this.confirmationOpenedEdit = true; 
      else   this.cancel();   
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
