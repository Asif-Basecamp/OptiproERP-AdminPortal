import { Component, OnInit } from '@angular/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { UsergroupService } from '../../service/usergroup.service'; 
import { MessageService } from '../../common/message.service'; 
@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.scss']

})
export class UserGroupComponent implements OnInit {
  model : any={}; 
  // public paginationButtonCount = 5;
  // public paginationInfo = true;
  // public paginationType: 'input';
  // public paginationPageSizes = true;
  // public paginationInfoPreviousNext = true;
  public dialogOpened = false;

  public gridData: any[];
  public DropDownListData: any[];
  constructor(private UserGroupService:UsergroupService, private MessageService:MessageService) { }    

  ngOnInit() {
    this.FillGrid();
    this.model.IsAdminEnabled = false;
    //this.FillDropdownList()
    debugger
    
  }
  FillGrid()
  {
    this.UserGroupService.GetUserGroupGridData(this.model).subscribe(    
      data => {    
        debugger;    
        //if(data.Status=="Success") 
        if(data.length>0)   
        {     
          this.gridData = data;
        }    
        else{ this.MessageService.errormessage("Something went wrong..");    
        }    
      },    
      error => {
        this.MessageService.errormessage(error.message);   
      });
   // this.gridData = UsergroupService;
    // this.isMobile();
  }
  SaveData()
  {
    this.UserGroupService.AddUser(this.model).subscribe(    
      data => {    
        debugger;    
        //if(data.Status=="Success") 
        if(data.length>0)   
        {     
          this.gridData = data;
        }    
        else{ this.MessageService.errormessage("Something went wrong..");    
        }    
      },    
      error => {
        this.MessageService.errormessage(error.message);   
      });
   
  }
  onChange(UserGrpId: string) {
    debugger
    this.UserGroupService.CheckDuplicateUserGroup(UserGrpId).subscribe(    
      data => { 
        debugger;   
        if(data.length>0)   
        {
          if(data[0].GroupCodeCount==1)
          {
            this.MessageService.errormessage("User Group is already exist..");
          }
          else{}  
        }    
        else{    
         this.MessageService.errormessage("Something went wrong..");
        }    
      },    
      error => {    
        this.MessageService.errormessage(error.message);
      });
};

FillDropdownList()
  {
     this.UserGroupService.FillDropDownList().subscribe(    
      data => {    
        debugger;    
        if(data.length>0)   
        {  
         this.DropDownListData = data; 
        }    
        else{    
          this.MessageService.errormessage("Something went wrong..");    
        }    
      },    
      error => {  
        this.MessageService.errormessage(error.message);   
      });
  }
  gridUserSelectionChange(gridUser, selection) {
    debugger
    this.dialougeToggle();
    // let selectedData = gridUser.data.data[selection.index];
    const selectedData = selection.selectedRows[0].dataItem;
    console.log(selectedData);
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

  public dialougeToggle() {
    this.FillDropdownList()
    this.dialogOpened = !this.dialogOpened;
    
  }
}
