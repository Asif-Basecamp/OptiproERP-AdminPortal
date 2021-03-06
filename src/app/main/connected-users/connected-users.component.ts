import { Component, OnInit } from '@angular/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { ConnectedUsersService } from 'src/app/service/Connectedusers.service';
import { MessageService } from '../../common/message.service';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonService } from 'src/app/service/common.service';

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
  selectedItem: string = "";  
  public Product: string ='';
  public Controller: string ='';
  public showConnectedUserMainPage: boolean = false;
 
  constructor(private translate: TranslateService, private httpClientSer: HttpClient,private ConnectedUserServ: ConnectedUsersService, 
    private MessageService:MessageService, private commonService: CommonService) { 
    translate.use(localStorage.getItem('applang'));
      translate.onLangChange.subscribe((event: LangChangeEvent) => {
          this.selectedItem = translate.instant("Login_Username"); 
      }); 
  }  

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
        this.ddlProductList = this.ddlProductList.filter(val => val.ProductId != 'ATD' && val.ProductId != 'DSB' && val.ProductId != 'CVP' && val.ProductId != 'TDC');
        console.log(data);
      },    
      error => { 
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

  productChange($event){
    this.ProductName = $event.ProductId;
  }

  onClickDisplay(){    

    this.Product = '';
    this.Controller = ''
    this.gridData = [];

    switch (this.ProductName)   
    { 
      case 'ATD': 
             this.Product = 'OptiProERPATD';  this.Controller = 'Login';
             break;

      case 'CNF': 
            this.Product = 'OptiProERPCNFService'; this.Controller = 'Base';
            break;

      case 'CVP': 
            this.Product = 'OptiProPortalService'; this.Controller = 'user'; 
            break;

      case 'MMO': 
            this.Product = 'OptiProERPMMOService'; this.Controller = 'MoveOrder';
            break;

      case 'SFES': 
            this.Product = 'OptiProERPSFESService'; this.Controller = 'SFDCLogin';
            break;

      case 'WMS': 
            this.Product = 'OptiProERPWMSService'; this.Controller = 'WMSlogin';
             break;             

      default:
           // this.Product = 'OptiProERPAdminService';
            break;

    }
    
    this.ConnectedUserServ.getConnectedUserData(this.Product,this.Controller).subscribe(
      data => {      
        if(data != undefined && data != null){
          this.gridData = data.LoggedUserData;
          if(this.gridData.length > 15)
          this.showConnectedUserMainPage = true;
          else
          this.showConnectedUserMainPage = false;
        }     
        else{
          this.MessageService.errormessage(this.translate.instant('No_Record_Found'));
       }
      },    
      error => {  
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

  logoutUser(dataItem,rowIndex){    
    this.ConnectedUserServ.RemoveLoggedInUser(this.Product,this.Controller,dataItem.GUID,dataItem.UserName).subscribe(
      data => {      
        if(data == true){
          this.MessageService.successmessage(this.translate.instant('User_Session_Terminated'));
          this.gridData.splice(rowIndex,1);      
        }     
        else{
          this.MessageService.errormessage(this.translate.instant('Cannot_Logout'));
       }
      },    
      error => {  
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
