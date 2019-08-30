import { Component, OnInit } from '@angular/core';
import { products } from 'src/app/dummyData/data';
import { GridComponent } from '@progress/kendo-angular-grid';
import { CheckableSettings } from '@progress/kendo-angular-treeview';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  // public paginationButtonCount = 5;
  // public paginationInfo = true;
  // public paginationType: 'input';
  // public paginationPageSizes = true;
  // public paginationInfoPreviousNext = true;
  public addUserScreen = false;

  public gridData: any[];
  public checkboxOnly = false;
  public mode = 'multiple';
  // public selectableSettings: SelectableSettings;

  public checkedKeys: any[] = [];

  constructor() { 
    //this.setSelectableSettings();
  }

  ngOnInit() {
    this.gridData = products;
    // this.isMobile();
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
