import { Component, OnInit } from '@angular/core';
import { products } from '../../dummyData/data';
import { GridComponent } from '@progress/kendo-angular-grid';
import { CheckableSettings } from '@progress/kendo-angular-treeview';
import { of, Observable } from 'rxjs';
import { UserManagementService } from '../../service/user-management.service';
import { MessageService } from '../../common/message.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RowArgs, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  selectedItem: string = "";
  // public paginationButtonCount = 5;
  // public paginationInfo = true;
  // public paginationType: 'input';
  // public paginationPageSizes = true;
  // public paginationInfoPreviousNext = true;
  public addUserScreen = false;
  dbName : string ="";
  public gridData: any[];
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
  public data = [{
      "ProductID": 1,
      "ProductName": "Chai",
      "UnitPrice": 18.0000,
      "Discontinued": false,
      "Category": {
          "CategoryID": 1,
          "CategoryName": "Beverages",
          "Description": "Soft drinks, coffees, teas, beers, and ales"
      }
    }, {
      "ProductID": 2,
      "ProductName": "Chang",
      "UnitPrice": 19.0000,
      "Discontinued": false,
      "Category": {
          "CategoryID": 1,
          "CategoryName": "Beverages",
          "Description": "Soft drinks, coffees, teas, beers, and ales"
      }
    }, {
      "ProductID": 3,
      "ProductName": "Aniseed Syrup",
      "UnitPrice": 10.0000,
      "Discontinued": false,
      "Category": {
          "CategoryID": 2,
          "CategoryName": "Condiments",
          "Description": "Sweet and savory sauces, relishes, spreads, and seasonings"
      }
  }];

  public listItems: Array<string> = ["X-Small", "Small", "Medium", "Large", "X-Large", "2X-Large"];
  
  constructor(private UserManagementService:UserManagementService,private MessageService:MessageService,
    private translate: TranslateService, private httpClientSer: HttpClient) { 
    translate.use(localStorage.getItem('applang'));
    translate.onLangChange.subscribe((event: LangChangeEvent) => { 
    }); 
  }

  ngOnInit() {
    this.ddlUserType=[];
    this.ddlUserType.push(
      { text: "Customer", value: "C" }, 
      { text: "Employee", value: "E" }, 
      { text: "Vendor", value: "V" }  
         
    );
    console.log(this.ddlUserType);
  }


  onFilterChange(checkBox:any,grid:GridComponent){
    if(checkBox.checked==false){
      this.clearFilter(grid);
    }
  }

  clearFilter(grid:GridComponent){      
    //grid.filter.filters=[];
  }

  public addUserScreenToggle() {
    this.addUserScreen = !this.addUserScreen; 
    this.oUserSelectedData.EmployeeId = [];
    this.oUserSelectedData.Warehouse = [];
    this.oUserSelectedData.WorkCenter = [];
    this.oUserSelectedData.Product = [];
    this.oUserSelectedData.Company = [];
    this.oUserSelectedData.Values = [];
    this.oUserSelectedData.PreviousUserId = [];
   this.FillCompNGrpNSAPUsrNProd();
  }
  FillCompNGrpNSAPUsrNProd()
  {
    
    this.UserManagementService.FillCompNGrpNSAPUsrNProd().subscribe(    
      data => {    
        if(data != null)   
        {     
          if (data.UserGroup.length > 0) {
            this.ddlUserGroup=[];
            this.ddlUserGroup=data.UserGroup;
            //---------------------------User Group---------------------------------//
            //Set value in our object array
            // oGroupCode.GroupCode = model.oData.UserGroup;
            // //it is the model used to bind with the combobox 
            // var oGroupCodeModel = new JSONModel(oGroupCode);
            // //model is binded here to combobox 
            // oCurrentController.getView().byId("cmbxUserGroupId").setModel(oGroupCodeModel);
            //---------------------------User Group---------------------------------//
        }
        if (data.SAPUser.length > 0) {
          this.ddlSAPUser=[];
          this.ddlSAPUser = data.SAPUser;
            //---------------------------SAP User---------------------------------//
            // oSAPUser.SAPUser = model.oData.SAPUser;
            // //create new model
            // var oUsers = new JSONModel(oSAPUser);
            // //set model in workcenter combo box
            // oCurrentController.getView().byId("cmbxSAPUsers").setModel(oUsers);
            //---------------------------SAP User---------------------------------//
        }
        if (data.ProductList.length > 0) {
          this.ddlProductList=[];
          this.ddlProductList=data.ProductList;
            // if (oProductList.ProductList.length == 0 && oProductList.originalProductList.length == 0) {
            //     for (var i = 0; i < model.oData.ProductList.length; i++) {
            //         oProductList.ProductList.push({
            //             productCode: model.oData.ProductList[i].ProductId,
            //             description: model.oData.ProductList[i].OPTM_PRODDESC,
            //             OPTM_ISWHSEENABLED: model.oData.ProductList[i].OPTM_ISWHSEENABLED,
            //             OPTM_ISWRKCENTERENABLED: model.oData.ProductList[i].OPTM_ISWRKCENTERENABLED,
            //             OPTM_ISEMPIDREQ: model.oData.ProductList[i].OPTM_ISEMPIDREQ

            //         });

            //         oProductList.originalProductList.push({
            //             productCode: model.oData.ProductList[i].ProductId,
            //             description: model.oData.ProductList[i].OPTM_PRODDESC,
            //             OPTM_ISWHSEENABLED: model.oData.ProductList[i].OPTM_ISWHSEENABLED,
            //             OPTM_ISWRKCENTERENABLED: model.oData.ProductList[i].OPTM_ISWRKCENTERENABLED,
            //             OPTM_ISEMPIDREQ: model.oData.ProductList[i].OPTM_ISEMPIDREQ

            //         });
            //     }
            // }
            // //oProductList.ProductList = model.oData;
            // var oProductModel = new JSONModel(oProductList);
            // oCurrentController.getView().byId("multcmbxProductsId").setModel(oProductModel);
        }
        if (data.CompanyList.length > 0) {
          this.ddlCompanyList = [];
          this.ddlCompanyList = data.CompanyList;
            //---------------------------Company List---------------------------------//
            //Set Company in Table
            // oCompanyList.CompanyList = model.oData.CompanyList;
            // var oCmpModel = new JSONModel(oCompanyList);
            // oCurrentController.getView().byId("tableCompanyDetailsId").setModel(oCmpModel);
            // // Set the checkbox as Checked on Edit Mode
            // oUserSelectedData.Company.forEach(function (CompanySaved) {
            //     var model = oCurrentController.getView().byId("tableCompanyDetailsId").getModel();
            //     var index = model.oData.CompanyList.findIndex(function (x) { return x.dbName == CompanySaved.Company });
            //     //issue occuring when the assingned DB was deleted
            //     if (index >= 0) {
            //         //to set the selected companies at the top of the table
            //         var tempCompany = model.oData.CompanyList[index];
            //         model.oData.CompanyList.splice(index, 1);
            //         //This is used to add any value in array at perticular position array.splice(position,0,data)
            //         model.oData.CompanyList.splice(0, 0, tempCompany);
            //         model.refresh();
            //     }
            // });

            // var allCompanies = oCurrentController.getView().byId("tableCompanyDetailsId").getItems();
            // //to check the checkbox of the selected database
            // for (var checkSelectedCompanies = 0; checkSelectedCompanies < oUserSelectedData.Company.length; checkSelectedCompanies++) {
            //     allCompanies[checkSelectedCompanies].setSelected(true);
            // }
            //---------------------------Company List---------------------------------//
           // oCurrentController.fillAfterInit();
        }
        }    
        else{ this.MessageService.errormessage(this.translate.instant('Somethingwrong'));    
        }    
      },    
      error => {
        this.MessageService.errormessage(error.message);   
      });
  }
  checkboxSelectionChange(ddlCompanyList, selection) {
    this.dbName= selection.selectedRows[0].dataItem.dbName;
    this.FillDDlEmployee(this.dbName); 
  }
  FillDDlEmployee(string : any)
  {
    this.UserManagementService.FillDDlEmployee(this.dbName).subscribe(    
      data => {    
        if(data != null)   
        {     
          
        }   
        else{ this.MessageService.errormessage(this.translate.instant('Somethingwrong'));    
        }    
      },    
      error => {
        this.MessageService.errormessage(error.message);   
      });
  }
  public mySelectionKey(context: RowArgs): string {
    return context.dataItem.ProductName + ' ' + context.index;
}

}
