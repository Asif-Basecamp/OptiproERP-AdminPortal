import { Component, OnInit } from '@angular/core';
import { products } from 'src/app/dummyData/data';
import { GridComponent, RowClassArgs } from '@progress/kendo-angular-grid';

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

  public gridData: any[];

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

}


