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
  // public selectableSettings: SelectableSettings;

  public checkedKeys: any[] = [];

  constructor(private UserManagementService:UserManagementService,private MessageService:MessageService,
    private translate: TranslateService, private httpClientSer: HttpClient) { 
    //this.setSelectableSettings();
    translate.use(localStorage.getItem('applang'));
    translate.onLangChange.subscribe((event: LangChangeEvent) => { 
    }); 
  }

  ngOnInit() {
    this.FillGridData();
    this.ddlUserType=[];
    this.ddlUserType.push(
      { text: "Customer", value: "C" }, 
      { text: "Employee", value: "E" }, 
      { text: "Vendor", value: "V" }  
         
    );
    console.log(this.ddlUserType);
    // this.isMobile();
  }
  FillGridData()
    {
    this.UserManagementService.FillGridData().subscribe(    
      data => { 
        if(data.Status == "Success") 
          {  
            this.gridData = data.data; 
          }    
      else{    
            this.MessageService.errormessage(this.translate.instant('Somethingwrong'));    
          }    
        },    
      error => {  
          this.MessageService.errormessage(error.message);   
        });
    }

  FillDropdownList()
    {
      this.UserManagementService.FillCompNGrpNSAPUsrNProd().subscribe(    
       data => { 
        data=data.data; 
        if(data.SAPUser.length>0)   this.ddlSAPUser=data.SAPUser;
        if(data.UserGroup.length>0)   this.ddlUserGroup=data.UserGroup;
        if(data.ProductList.length>0)   this.GridUserMgmtProduct=data.ProductList;
        if(data.CompanyList.length>0)   this.GridCompany=data.CompanyList;
         //if(data.UserGroup.length>0)   
        //  {  
           //this.ddlUserGroup=data.UserGroup;
          //  if(data.SAPUser.length>0)   this.ddlSAPUser=data.SAPUser;
          //  if(data.ProductList.length>0) this.ddlUserMgmtProduct=data.ProductList;
          // if(data.CompanyList.length>0)
          //this.DropDownListData = data; 
        // }    
        //  else{    
        //    this.MessageService.errormessage("Something went wrong..");    
        //  }    
       },    
       error => {  
         this.MessageService.errormessage(error.message);   
       });
    }

  GrdUserMgmtSelectionChange(grid,event)
    {
      this.UserManagementService.FillDDlEmployee(event.selectedRows[0].dataItem.dbName).subscribe(    
        data => {  
        },    
        error => {  
          this.MessageService.errormessage(error.message);   
        });
    }
  onFilterChange(checkBox:any,grid:GridComponent){
    if(checkBox.checked==false){
      this.clearFilter(grid);
    }
  }

  clearFilter(grid:GridComponent){      
    //grid.filter.filters=[];
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

  public addUserScreenToggle() {
    this.addUserScreen = !this.addUserScreen;
    this.FillDropdownList();
  }

  

  public get checkableSettings(): CheckableSettings {
      return {
          checkChildren: true,
          checkParents: true,
          enabled: true,
          mode: 'multiple',
          checkOnClick: false
      };
  }

  public treeData: any[] = [
      {text: 'Warehouse-1', items: [
          { text: 'Work Center 1-1' },
          { text: 'Work Center 1-2' },          
          { text: 'Work Center 1-3' }         
        ]
      },
      {text: 'Warehouse-2', items: [
          { text: 'Work Center 2-1' },
          { text: 'Work Center 2-2' },          
          { text: 'Work Center 2-3' },       
          { text: 'Work Center 2-4' },       
        ]
      },
      {text: 'Warehouse-3', items: [
          { text: 'Work Center 3-1' },
          { text: 'Work Center 3-2' },          
          { text: 'Work Center 3-3' }         
        ]
        },
      {text: 'Warehouse-4', items: [
          { text: 'Work Center 4-1' },
          { text: 'Work Center 4-2' },          
          { text: 'Work Center 4-3' }         
        ]
      },
      {text: 'Warehouse-5', items: [
          { text: 'Work Center 5-1' },
          { text: 'Work Center 5-2' },          
          { text: 'Work Center 5-3' },       
          { text: 'Work Center 5-4' },       
        ]
      },
      {text: 'Warehouse-6', items: [
        { text: 'Work Center 6-1' },
        { text: 'Work Center 6-2' },          
        { text: 'Work Center 6-3' }         
      ]
      },
  ];

  /**
   * The field that holds the keys of the expanded nodes.
   */
  public keys: string[] = [];

  /**
   * A function that checks whether a given node index exists in the expanded keys collection.
   * If the index can be found, the node is marked as expanded.
   */
  public isExpanded = (dataItem: any, index: string) => {
      return this.keys.indexOf(index) > -1;
  }

  /**
   * A `collapse` event handler that will remove the node hierarchical index
   * from the collection, collapsing its children.
   */
  public handleCollapse(node) {
      this.keys = this.keys.filter(k => k !== node.index);
  }

  /**
   * An `expand` event handler that will add the node hierarchical index
   * to the collection, expanding the its children.
   */
  public handleExpand(node) {
      this.keys = this.keys.concat(node.index);
  }


  public children = (dataItem: any): Observable<any[]> => of(dataItem.items);
  public hasChildren = (dataItem: any): boolean => !!dataItem.items;

}
