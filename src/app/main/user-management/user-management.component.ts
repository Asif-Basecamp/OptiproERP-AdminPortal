import { Component, OnInit } from '@angular/core';
import { products } from 'src/app/dummyData/data';
import { GridComponent } from '@progress/kendo-angular-grid';
import { CheckableSettings } from '@progress/kendo-angular-treeview';
import { of, Observable } from 'rxjs';
import { UserManagementService } from 'src/app/service/user-management.service';
import { MessageService } from '../../common/message.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  public gridData: any[];
  public checkboxOnly = false;
  public mode = 'multiple';
  public ddlUserGroup: any[];
  public ddlSAPUser: any[];
  public GridCompany: any[];
  public GridUserMgmtProduct: any[];
  public ddlUserType: any[];

  public checkedKeys: any[] = [];


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
  }




}
