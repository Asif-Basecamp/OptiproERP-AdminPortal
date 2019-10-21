import { Component, OnInit } from '@angular/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { ConnectedusersService } from 'src/app/service/Connectedusers.service';
import { MessageService } from '../../common/message.service';

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
  public ddlProductList: any[];
  public PlaceHolder = { ProductId: 'Select Product..'};
  public ProductName: string = 'Select Product..';

  constructor(private ConnectedUserServ: ConnectedusersService, private MessageService:MessageService) { }

  ngOnInit() {
        
    // this.isMobile();
    this.getProductList();
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

  getProductList(){

    this.ConnectedUserServ.getProductList().subscribe(
      data => {
        this.ddlProductList = data; 
        console.log(data);
      },    
      error => {  
        this.MessageService.errormessage(error.message);
      }); 
  } 

  productChange($event){
    this.ProductName = $event.ProductId;
  }

  onClickDisplay(){    

    let Product = '';
    let Controller = ''

    switch (this.ProductName)   
    { 
      case 'ATD': 
             Product = 'OptiWMS'; 
             break;

      case 'CNF': 
            Product = 'optiproconfigurator'; Controller = 'Base';
            break;

      case 'CVP': 
            Product = 'OptiWMS';
            break;

      case 'WMS': 
             Product = 'OptiPROWMS'; Controller = 'Login';
             break;
             

      default:
            Product = 'OptiAdmin';
            break;

    }

    this.ConnectedUserServ.getConnectedUserData(Product,Controller).subscribe(
      data => {
        console.log(data);
        if(data != undefined && data != null){
          this.gridData = data.LoggedUserData;
        }     
        else{
          this.MessageService.errormessage("No record found");
       }
      },    
      error => {  
        this.MessageService.errormessage(error.message);
    });
  }
 
}
