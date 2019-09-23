import { Component, OnInit } from '@angular/core';
import { products } from 'src/app/dummyData/data';
import { GridComponent, RowClassArgs } from '@progress/kendo-angular-grid';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-user-authorization',
  templateUrl: './user-authorization.component.html',
  styleUrls: ['./user-authorization.component.scss']
})
export class UserAuthorizationComponent implements OnInit {
  selectedItem: string = ""; 
  // public paginationButtonCount = 5;
  // public paginationInfo = true;
  // public paginationType: 'input';
  // public paginationPageSizes = true;
  // public paginationInfoPreviousNext = true;
  public addAuthScreen = false;

  public gridData: any[];

  public checkedKeys: any[] = [];
  public dialogOpened: boolean;

  constructor(private translate: TranslateService, private httpClientSer: HttpClient) {
    // let userLang = navigator.language.split('-')[0];
    //   userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(localStorage.getItem('applang'));
      translate.onLangChange.subscribe((event: LangChangeEvent) => { 
      }); 
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

  public rowCallback(context: RowClassArgs) {
      const isEven = context.index % 3 == 0;
      return {
        exceptional: isEven,
      };
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

  public addAuthScreenToggle() {
    this.addAuthScreen = !this.addAuthScreen;
  }

  public dialougeToggle() {
    this.dialogOpened = !this.dialogOpened;
  }
}


