import { Component, OnInit } from '@angular/core';
import { products } from 'src/app/dummyData/data';
import { GridComponent, RowClassArgs } from '@progress/kendo-angular-grid';
import { AuthorizationService } from 'src/app/service/authorization.service';
import { MessageService } from '../../common/message.service';

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
  public gridDataRoles: any[];
  public checkedKeys: any[] = [];
  public dialogOpened: boolean;
  public ddlUserGroup: any[];
  public PlaceHolder = { OPTM_GROUPCODE: 'Select User Group..'};
  public UserGroup: string = 'Select User Group..';
  public userGridLookup: any[];
  public inputVal: string = '';
  public inputRole = [];
  public oModalData: any = {};
  public isEdit:boolean = false;
  public allUsersDDL: any [];
  public defaultItem:any;
  public screenGrid: any[];
  public showDisplayBtn:boolean = false;
  public DataForUserGroup: any;
  public selectAllCheckBox: boolean = false;
  public loggedInUser : string = '';

  constructor(private AuthServ: AuthorizationService, private MessageService:MessageService, private translate: TranslateService, private httpClientSer: HttpClient) {
    // let userLang = navigator.language.split('-')[0];
    //   userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(localStorage.getItem('applang'));
      translate.onLangChange.subscribe((event: LangChangeEvent) => { 
      }); 
 }

  ngOnInit() {
   
    this.getPermissionView();
    this.oModalData.User = [];
    this.oModalData.SelectedRole = []; 
    //this.loggedInUser = window.localStorage.getItem('LoggedInUser');
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

  public addAuthScreenToggle(mode) {
    
    this.addAuthScreen = !this.addAuthScreen;
    this.inputRole = [];

    if(this.addAuthScreen){

      if(mode == 'edit'){
        this.getAllUserGroup();       
      } 
      else{
        this.getRoles(mode);
      }          
      this.getUserGroup();
     
    }
    
    if(mode == 'add'){
     this.isEdit = false;
     this.inputVal = '';     
     this.userGridLookup = []; this.screenGrid = [];
    }
  }

  public dialougeToggle() {

    if(this.inputRole.length <= 0){
      this.MessageService.errormessage('Please select role');
      return false;
    }

    this.dialogOpened = !this.dialogOpened;   
  }

  getPermissionView(){
    this.AuthServ.getPermissionView().subscribe(
      data => {
        this.gridData = data; 
      },    
      error => {  
        this.MessageService.errormessage(error.message);
    }); 
  }

  getUserForLookup(){
  
    this.AuthServ.getUsers(this.UserGroup).subscribe(
      data => {  
        this.userGridLookup = data.USERDETAILS;  
      },    
      error => {  
        this.MessageService.errormessage(error.message);
    });

  }

  userGroupChange($event){
    this.UserGroup = $event.OPTM_GROUPCODE;

    this.getUserForLookup();

  //   this.checkInvalidGroup();

  //   this.AuthServ.checkUserCodeExists(this.UserGroup).subscribe(
  //   data => {       
  //     if(data == "Record Exists"){
  //     let isOverwrite = false;
  //     isOverwrite = confirm("Record already exists. Do you want to overwrite it?");
  
  //     if(isOverwrite){
  //       this.MessageService.successmessage("Yes");
  //     }
  //     else{
  //       this.MessageService.errormessage("No");
  //     }
      
  //     }  
  //     else{
  //      this.MessageService.errormessage("Record does not exists");
  //     }      
  //   },    
  //   error => {  
  //     this.MessageService.errormessage(error.message);
  //  });
    
  }

  getAllUserGroup(){
    this.AuthServ.getUserGroup().subscribe(
      data => {
        this.allUsersDDL = data;         
      },    
      error => {  
        this.MessageService.errormessage(error.message);
    });
  }

  getUserGroup(){
    this.AuthServ.getUserGroup().subscribe(
      data => {
      this.ddlUserGroup = [];   
      for(let i=0; i < data.length; i++){
        for(let j=0; j < this.gridData.length; j++){
          if(data[i].OPTM_GROUPCODE == this.gridData[j].OPTM_USERGROUP){
            data.splice(i,1)
          }
        }
      }      
       this.ddlUserGroup = data;  
       this.defaultItem = this.ddlUserGroup[0];       
      },    
      error => {  
        this.MessageService.errormessage(error.message);
    });
  }

  getRoles(mode){
    this.AuthServ.getRoles().subscribe(
      data => {       
      this.gridDataRoles = data;  
      if(mode == 'edit'){
        for(let i=0; i<this.DataForUserGroup.OPTM_ADMIN_AUTHR.length; i++){
          for(let j=0; j<this.gridDataRoles.length; j++){
            if(this.DataForUserGroup.OPTM_ADMIN_AUTHR[i].OPTM_ROLEID == this.gridDataRoles[j].OPTM_ROLEID ){
              this.gridDataRoles[j].checked = true;
              this.inputRole.push({
                OPTM_ROLEID: this.gridDataRoles[j].OPTM_ROLEID
              });
            }
            else{
              this.gridDataRoles[j].checked = false;
            }
          }
        }  
        
        this.getMenuList('show');
        this.CheckUserPermissionForProduct('editBtn');
      }
      else{
          for(let i=0; i<this.gridDataRoles.length; i++){
          this.gridDataRoles[i].checked = false;
        } 
      }
        
      },    
      error => {  
        this.MessageService.errormessage(error.message);
    });
  }

  // checkUserCodeExists(){
  //   this.AuthServ.checkUserCodeExists(this.UserGroup).subscribe(
  //     data => {       
  //       if(data == "Record Exists"){
  //         return true;
  //       }  
  //       else{
  //         return false;
  //       }      
  //     },    
  //     error => {  
  //       this.MessageService.errormessage(error.message);
  //       //return false;
  //   });
  //   return false;
  // }

  gridUserSelection($event){
    this.inputVal = $event.selectedRows[0].dataItem.OPTM_USERCODE;
    this.CheckUserPermissionForProduct('grid'); 
    //this.dialougeToggle();  
  }

  CheckUserPermissionForProduct(area){

    this.oModalData.User = [];
    this.oModalData.User.push({
      User: this.inputVal
    })

    // var jObject = { UserGroup: JSON.stringify(this.oModalData) };
    // console.log(jObject);

    this.AuthServ.checkUserPermissionForProduct(this.oModalData).subscribe(
    data => {       
      
       if(data != 'exist'){
        this.MessageService.errormessage(data);
        this.screenGrid = [];
       // this.inputVal = '';
       //this.oModalData.User = [];
       }
      
        if(this.inputRole.length > 0 && this.inputVal != '')
        this.showDisplayBtn = true;
      
        if(area == 'grid')
        this.dialougeToggle();
    },    
    error => {  
      this.MessageService.errormessage(error.message);
  });

  }

  // selectUserRole($event){

  //  if($event.selectedRows.length > 1 || $event.deselectedRows.length > 1){
  //   return false;
  //  } 

  //   this.oModalData.SelectedRole = [];       
  //   if($event.selectedRows.length > 0){         
  //       this.inputRole.push({
  //         OPTM_ROLEID: $event.selectedRows[0].dataItem.OPTM_ROLEID
  //       });           
  //   }
  //   else{
  //     let deselectVal = $event.deselectedRows[0].dataItem.OPTM_ROLEID;
  //     const index = this.inputRole.findIndex(val => val.OPTM_ROLEID === deselectVal);
  //     this.inputRole.splice(index,1);
  //   } 

  //   this.getMenuList('hide');
  // }

  getMenuList(state){

    for(let i=0; i < this.inputRole.length; i++){
      for(let j=0; j < this.gridDataRoles.length; j++){
        if(this.inputRole[i].OPTM_ROLEID == this.gridDataRoles[j].OPTM_ROLEID){

          this.oModalData.SelectedRole.push({
              Product: this.gridDataRoles[j].OPTM_PROD
          })         
        }
      }
    } 
  
  if(state == 'show'){
    this.AuthServ.getMenuList(this.inputRole).subscribe(
      data => {      
       this.screenGrid = data.Table;
       for(let i=0; i<this.screenGrid.length; i++){

        if(this.screenGrid[i].AddSelected == '')
         this.screenGrid[i].AddSelected = false;
        if(this.screenGrid[i].UpdateSelected == '')
         this.screenGrid[i].UpdateSelected = false;
        if(this.screenGrid[i].DeleteSelected == '')
         this.screenGrid[i].DeleteSelected = false;
        if(this.screenGrid[i].ReadSelected == '')
         this.screenGrid[i].ReadSelected = false;

        let permissionVal = this.screenGrid[i].OPTM_PERMISSION.split(",");

        for(let j=0; j<permissionVal.length; j++){
          if(permissionVal[j] == 'A')
            this.screenGrid[i].AddSelected = true;
          else if(permissionVal[j] == 'U')
            this.screenGrid[i].UpdateSelected = true;
          else if(permissionVal[j] == 'D')
            this.screenGrid[i].DeleteSelected = true;
          else if(permissionVal[j] == 'R')
            this.screenGrid[i].ReadSelected = true;
         }
      }       
    },    
      error => {  
        this.MessageService.errormessage(error.message);
    }); 
  }
 }

 saveRecord(){

  console.log(this.screenGrid);
  console.log(this.gridDataRoles);
  
  var oSaveModel:any = {};
  oSaveModel.OPTM_ADMIN_AUTHR = [];
  oSaveModel.OPTM_ADMIN_AUTHRUSER = [];

  for(let idx=0; idx<this.gridDataRoles.length; ){
  if(this.gridDataRoles[idx].checked == true){   
  oSaveModel.OPTM_ADMIN_AUTHR.push({
    OPTM_AUTHCODE:this.gridDataRoles[idx].OPTM_USERGROUP, //add auth code
    OPTM_USERGROUP:this.gridDataRoles[idx].OPTM_USERGROUP,
    OPTM_ROLEID: this.gridDataRoles[idx].OPTM_ROLEID,
    OPTM_CREATEDATE: '000-00-00',
    OPTM_USERID: 'admin'
 });
}
}

 for(let i=0; i<this.screenGrid.length; i++){  
  
  const index = this.DataForUserGroup.OPTM_ADMIN_AUTHRUSER.findIndex(r=>r.OPTM_MENUID == this.screenGrid[i].OPTM_MENUID);
    
  oSaveModel.OPTM_ADMIN_AUTHRUSER.push({
    OPTM_USERGROUP: this.DataForUserGroup.OPTM_ADMIN_AUTHR[0].OPTM_USERGROUP,
    OPTM_ROLEID: this.screenGrid[i].OPTM_ROLEID,
    OPTM_MENUID: this.screenGrid[i].OPTM_MENUID,
    OPTM_PERMISSION: "",
    OPTM_CREATEDATE: '000-00-00',
    OPTM_USERCODE: this.DataForUserGroup.OPTM_ADMIN_AUTHR[0].OPTM_USERGROUP,
    AddSelected: this.screenGrid[i].AddSelected,
    UpdateSelected: this.screenGrid[i].UpdateSelected,
    DeleteSelected: this.screenGrid[i].DeleteSelected,
    ReadSelected: this.screenGrid[i].ReadSelected,
    OPTM_USERID: 'admin',
    OPTM_AUTHCODE: this.DataForUserGroup.OPTM_ADMIN_AUTHRUSER[index].OPTM_AUTHCODE
  });
}

  this.AuthServ.AddPermission(oSaveModel).subscribe(
    data => { 
      if(data == "True"){
        this.MessageService.successmessage("Operation Completed Successfully");
        this.addAuthScreenToggle('add');
      }
      else{
        this.MessageService.errormessage(data);
      }
    },    
    error => {  
      this.MessageService.errormessage(error.message);
  }); 
}

 editUser($event){
  let userGrp ;
  if($event.selectedRows.length > 0)
     userGrp = $event.selectedRows[0].dataItem.OPTM_USERGROUP;
  else
     userGrp = $event.selectedRows[0].dataItem.OPTM_USERGROUP;    
     
  this.isEdit = true;
  this.addAuthScreenToggle('edit'); 
   
  this.AuthServ.GetDataForUserGroup(userGrp).subscribe(
    data => {    
        
        this.DataForUserGroup = data;
        this.ddlUserGroup = this.allUsersDDL.filter(val => val.OPTM_GROUPCODE == userGrp);
        this.defaultItem = this.ddlUserGroup[0];
        this.inputVal = userGrp;
        this.showDisplayBtn = true;  
        this.getRoles('edit');      
      
        // for(let i=0; i<data.OPTM_ADMIN_AUTHR.length; i++){
        //   for(let j=0; j<this.gridDataRoles.length; j++){

        //     if(data.OPTM_ADMIN_AUTHR[i].OPTM_ROLEID == this.gridDataRoles[j].OPTM_ROLEID ){
        //       this.gridDataRoles[j].checked = true;
        //       this.inputRole.push({
        //         OPTM_ROLEID: this.gridDataRoles[j].OPTM_ROLEID
        //       });
        //     }
        //   }
        // }

        // this.getMenuList('show');
        // this.CheckUserPermissionForProduct('edit');   

    },    
    error => {  
      this.MessageService.errormessage(error.message);
  });
}

selectCheckboxRole(checkvalue,rowdata,idx){ 

  this.oModalData.SelectedRole = [];       
    if(checkvalue){ 

       this.gridDataRoles[idx].checked = true;

        this.inputRole.push({
          OPTM_ROLEID: rowdata.OPTM_ROLEID
        });      
        
      if(this.gridDataRoles.filter(r=>r.checked == true).length == this.gridDataRoles.length){
        this.selectAllCheckBox = true;   
        (document.getElementById("selectAllCheckboxId") as HTMLInputElement).checked = true;
      }           
      else{
        this.selectAllCheckBox = false; 
        (document.getElementById("selectAllCheckboxId") as HTMLInputElement).checked = false;
      }
             
    }
    else{
      this.gridDataRoles[idx].checked = false; 
      this.selectAllCheckBox = false; 
      (document.getElementById("selectAllCheckboxId") as HTMLInputElement).checked = false;
      let deselectVal = rowdata.OPTM_ROLEID;
      const index = this.inputRole.findIndex(val => val.OPTM_ROLEID === deselectVal);
      this.inputRole.splice(index,1);
    } 
    this.getMenuList('hide');
 }

  displayMenu(){
    this.getMenuList('show');
  }

  deleteMenu(){
    this.screenGrid = [];
  }

  onSelectAllChange($event){
  
    this.oModalData.SelectedRole = [];       
    if($event == "checked"){ 
     this.selectAllCheckBox = true;
     (document.getElementById("selectAllCheckboxId") as HTMLInputElement).checked = true;
     for(let i=0; i<this.gridDataRoles.length; i++){
      this.gridDataRoles[i].checked = true;
      this.inputRole.push({
        OPTM_ROLEID: this.gridDataRoles[i].OPTM_ROLEID
      }); 
     }
     this.getMenuList('hide');
    }
    else{
      this.selectAllCheckBox = false;
      (document.getElementById("selectAllCheckboxId") as HTMLInputElement).checked = false;
      this.inputRole = [];
      for(let i=0; i<this.gridDataRoles.length; i++){
        this.gridDataRoles[i].checked = false;
      }
    }     
  }

  addSelectChange(isCheck,idx){
    if(isCheck)
    this.screenGrid[idx].AddSelected = true;
    else
    this.screenGrid[idx].AddSelected = false;
  }

  updateSelectChange(isCheck,idx){
    if(isCheck)
    this.screenGrid[idx].UpdateSelected = true;
    else
    this.screenGrid[idx].UpdateSelected = false;
  }

  deleteSelectChange(isCheck,idx){
    if(isCheck)
    this.screenGrid[idx].DeleteSelected = true;
    else
    this.screenGrid[idx].DeleteSelected = false;
  }

  readSelectChange(isCheck,idx){
    if(isCheck)
    this.screenGrid[idx].ReadSelected = true;
    else
    this.screenGrid[idx].ReadSelected = false;
  }

  
  
}

