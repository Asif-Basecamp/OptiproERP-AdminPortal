import { Component, OnInit } from '@angular/core';
import { products } from 'src/app/dummyData/data';
import { GridComponent } from '@progress/kendo-angular-grid';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-connected-users',
  templateUrl: './connected-users.component.html',
  styleUrls: ['./connected-users.component.scss']
})

export class ConnectedUsersComponent implements OnInit {
  // public paginationButtonCount = 5;
  // public paginationInfo = true;
  // public paginationType: 'input';
  // public paginationPageSizes = true;
  // public paginationInfoPreviousNext = true;
  public gridData: any[];
  selectedItem: string = ""; 
  constructor(private translate: TranslateService, private httpClientSer: HttpClient) { 
    translate.use(localStorage.getItem('applang'));
      translate.onLangChange.subscribe((event: LangChangeEvent) => {
          this.selectedItem = translate.instant("Login_Username"); 
      }); 
  }  

  ngOnInit() {
    // this.gridData = products;
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
}
