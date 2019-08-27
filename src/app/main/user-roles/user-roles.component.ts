import { Component, OnInit } from '@angular/core';
import { products } from 'src/app/dummyData/data';
import { GridComponent, SelectableSettings } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})

export class UserRolesComponent implements OnInit {

  // public paginationButtonCount = 5;
  // public paginationInfo = true;
  // public paginationType: 'input';
  // public paginationPageSizes = true;
  // public paginationInfoPreviousNext = true;
  public addRolesScreen = false;

  public gridData: any[];
  public checkboxOnly = false;

  constructor() { 
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


  public addRolesScreenToggle() {
    this.addRolesScreen = !this.addRolesScreen;
  }
}
