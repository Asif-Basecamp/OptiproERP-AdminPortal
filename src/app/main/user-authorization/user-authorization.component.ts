import { Component, OnInit } from '@angular/core';
import { products } from '../../dummyData/data';
import { GridComponent, RowClassArgs } from '@progress/kendo-angular-grid';
import { AuthorizationService } from '../../service/authorization.service';
import { MessageService } from '../../common/message.service';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RowArgs } from '@progress/kendo-angular-grid';
import { filterBy } from '@progress/kendo-data-query';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-user-authorization',
  templateUrl: './user-authorization.component.html',
  styleUrls: ['./user-authorization.component.scss']
})
export class UserAuthorizationComponent implements OnInit {
  selectedItem: string = ""; 
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
  public confirmationOpened = false;
  public Loading: boolean = false;
  public user_select : any;
  public LocalUserGrid: any [] = [];
  public selectedUser: string = '';
  public SavedMenu: any[] = [];
  public MenuGrid: any[] = [];
  public oSaveUserScreenModel: any = [];
  public isUserCodeSelected: any;
  public confirmationOpenedEdit = false; 
  public FilterData: any[]; 
  public showGridDataPage: boolean = false;
  //public showGridUserPage: boolean = false;
  //public showGridRolePage: boolean = false;
  
  constructor(private AuthServ: AuthorizationService, private MessageService:MessageService, private translate: TranslateService, private httpClientSer: HttpClient,
    private commonService: CommonService) {
    translate.use(localStorage.getItem('applang'));
      translate.onLangChange.subscribe((event: LangChangeEvent) => { 
    }); 
  }

  ngOnInit() {
    this.translate.get('Select_User_Group').subscribe((res: string) => {
      this.user_select = res;
    }); 
    this.getPermissionView();
    this.getAllUserGroup();
    this.oModalData.User = [];
    this.oModalData.SelectedRole = [];    
  }

  public confirmationEditToggle() {  
    this.confirmationOpenedEdit = !this.confirmationOpenedEdit;    
  }

  onFilterChange(checkBox:any,grid:GridComponent){
    if(checkBox.checked==false){
     // this.clearFilter(grid);
    }
  }

  public rowCallback(context: RowClassArgs) {
      const isEven = context.index % 3 == 0;
      return {
        exceptional: isEven,
      };
  }

  /*-- get list of users on home screen --*/
  getPermissionView(){
    //this.Loading = true;
    this.AuthServ.getPermissionView().subscribe(
      data => {
        this.gridData = data;
        this.FilterData = data;
        if(this.gridData.length > 15){
          this.showGridDataPage = true;
        }
        else{
          this.showGridDataPage = false;
        }   
        this.Loading = false;
      },    
      error => { 
        this.Loading = false; 
        if(error.error != null && error.error != undefined){
          if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
            this.commonService.unauthorizedToken(error);               
          }
        }
        else{
          this.MessageService.errormessage(error.message);
        }
    }); 
  }

  /*-- get list of users on click search icon --*/
  getUserForLookup(){
    this.AuthServ.getUsers(this.UserGroup).subscribe(
      data => {  
        this.userGridLookup = data.USERDETAILS; 
      },    
      error => {  
        if(error.error != null && error.error != undefined){
          if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
            this.commonService.unauthorizedToken(error);               
          }
        }
        else{
          this.MessageService.errormessage(error.message);
        }
    });
  }

  /*-- get list of user group --*/
  getAllUserGroup(){
    this.Loading = true;
    this.AuthServ.getUserGroup().subscribe(
      data => {
        this.allUsersDDL = data; 
        this.Loading = false;        
      },    
      error => {  
        this.Loading = false;    
        if(error.error != null && error.error != undefined){
          if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
            this.commonService.unauthorizedToken(error);               
          }
        }
        else{
          this.MessageService.errormessage(error.message);
        }
    });
  }

  /*-- condition of add or edit screen --*/
  public addAuthScreenToggle(mode) {

    if(mode == 'confirm' && !this.isEdit)
       mode = 'Cancel';    

    if(mode == 'confirm'){
      this.confirmationEditToggle();
    }
    else if(mode == 'Cancel'){
      this.confirmationOpenedEdit = false;
      this.addAuthScreen = !this.addAuthScreen;
      this.oSaveUserScreenModel = [];
      this.inputRole = []; 
    
      this.isEdit = false;
      this.inputVal = '';     
      this.userGridLookup = []; 
      this.screenGrid = [];
      this.MenuGrid = [];
      this.LocalUserGrid = [];
    }
    else{
    this.addAuthScreen = !this.addAuthScreen;
    this.oSaveUserScreenModel = [];
    this.inputRole = [];   

    if(this.addAuthScreen){
      if(mode != 'edit'){
        this.UserGroup = this.user_select;
        this.defaultItem = '';
        this.getRoles(mode);      
      }              
      this.getUserGroup();
    }
   }    
    
  }

  /*-- select user screen on click search icon --*/
  public dialougeToggle() {
    if(this.UserGroup === 'Select User Group..'){
      this.translate.get('Select_User_MSG').subscribe((res: string) => {
        this.MessageService.errormessage(res);
      }); 
      return false;
    }else{
     
      this.dialogOpened = !this.dialogOpened;
    }
  }

  /*-- on click user group --*/
  userGroupChange($event){
    this.UserGroup = $event.OPTM_GROUPCODE;
    this.getUserForLookup();
  }

  getUserGroup(){
    this.AuthServ.getUserGroup().subscribe(
      data => {
      this.ddlUserGroup = []; 
      if(data){
        for(let i=0; i < data.length; i++){
          for(let j=0; j < this.gridData.length; j++){
            if(data[i].OPTM_GROUPCODE == this.gridData[j].OPTM_USERGROUP){
              data.splice(i,1)
            }
          }
        }    
      }    
       this.ddlUserGroup = data; 
      
      },    
      error => { 
        if(error.error != null && error.error != undefined){
          if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
            this.commonService.unauthorizedToken(error);               
          }
        }
        else{
          this.MessageService.errormessage(error.message);
        }
    });
  }

  getRoles(mode){
    this.Loading = true;
    this.AuthServ.getRoles().subscribe(
      data => {       
      this.gridDataRoles = data; 
      
      for(let idx=0; idx<this.gridDataRoles.length; idx++){
        this.gridDataRoles[idx].checked = false;
      } 
      
      if(mode == 'edit'){
        for(let i=0; i<this.DataForUserGroup.OPTM_ADMIN_AUTHR.length; i++){
          for(let j=0; j<this.gridDataRoles.length; j++){
            if(this.DataForUserGroup.OPTM_ADMIN_AUTHR[i].OPTM_ROLEID == this.gridDataRoles[j].OPTM_ROLEID ){
              this.gridDataRoles[j].checked = true;
              this.gridDataRoles[j].OPTM_AUTHCODE = this.DataForUserGroup.OPTM_ADMIN_AUTHR[i].OPTM_AUTHCODE
              this.inputRole.push({
                OPTM_ROLEID: this.gridDataRoles[j].OPTM_ROLEID,
                OPTM_AUTHCODE: this.DataForUserGroup.OPTM_ADMIN_AUTHR[i].OPTM_AUTHCODE
              });
            }          
          }
        } 
        
       // this.getMenuList('show');
        this.getSavedMenu();
        this.getModalArray();
        //this.CheckUserPermissionForProduct('editBtn');
      }
      this.Loading = false;
    },    
      error => {  
        this.Loading = false;    
        if(error.error != null && error.error != undefined){
          if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
            this.commonService.unauthorizedToken(error);               
          }
        }
        else{
          this.MessageService.errormessage(error.message);
        }
    });
  }

  getModalArray(){
    for(let i=0; i < this.inputRole.length; i++){
      for(let j=0; j < this.gridDataRoles.length; j++){
        if(this.inputRole[i].OPTM_ROLEID == this.gridDataRoles[j].OPTM_ROLEID){          
          this.oModalData.SelectedRole.push({
              Product: this.gridDataRoles[j].OPTM_PROD
          })         
        }
      }
    }
  }

  gridUserSelection($event){
    this.inputVal = $event.selectedRows[0].dataItem.OPTM_USERCODE; 
    this.selectedUser = this.inputVal;     
    if(this.LocalUserGrid.length > 0){
      var index = this.LocalUserGrid.findIndex(r=>r.UserCode == this.inputVal); 
      if(index != -1){ 
        alert(this.translate.instant('User_Already_Selected'));         
        this.inputVal = '';
        this.selectedUser = '';
        return;
      }    
    } 
    this.CheckUserPermissionForProduct('grid'); 
  }

  CheckUserPermissionForProduct(area){
    this.oModalData.User = [];
    this.oModalData.User.push({
     // User: this.inputVal
     User: this.selectedUser
    })
    this.AuthServ.checkUserPermissionForProduct(this.oModalData).subscribe(
    data => { 
      if(data != 'exist'){
        this.MessageService.errormessage(data);
        if(area == 'grid'){
          this.inputVal = '';
          this.selectedUser = '';
        }        
        //this.screenGrid = [];
        //this.MenuGrid = [];        
        //this.LocalUserGrid = [];
      }
      
      if(this.inputRole.length > 0 && this.selectedUser != '')
        this.showDisplayBtn = true;
        if(area == 'grid')
        this.dialougeToggle();
      },    
    error => {
      if(error.error != null && error.error != undefined){
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
      }
      else{
        this.MessageService.errormessage(error.message);
      }
    });
  }

  getSavedMenu(){ 
    this.Loading = true;
    this.oSaveUserScreenModel = [];   
    this.SavedMenu = this.DataForUserGroup.OPTM_ADMIN_AUTHRUSER;
    let tempArr = this.SavedMenu;
    
    for(let tempIdx=0; tempIdx < this.DataForUserGroup.OPTM_ADMIN_AUTHRUSER.length; tempIdx++){
      var Permission = this.DataForUserGroup.OPTM_ADMIN_AUTHRUSER[tempIdx].OPTM_PERMISSION.split(",");      
      for (var iPermissionIndex = 0; iPermissionIndex < Permission.length; iPermissionIndex++) {
        if (Permission[iPermissionIndex] == "A")
        this.DataForUserGroup.OPTM_ADMIN_AUTHRUSER[tempIdx].AddSelected = true;
        else if (Permission[iPermissionIndex] == "U")
        this.DataForUserGroup.OPTM_ADMIN_AUTHRUSER[tempIdx].UpdateSelected = true;
        else if (Permission[iPermissionIndex] == "D")
        this.DataForUserGroup.OPTM_ADMIN_AUTHRUSER[tempIdx].DeleteSelected = true;
        else if (Permission[iPermissionIndex] == "R")
        this.DataForUserGroup.OPTM_ADMIN_AUTHRUSER[tempIdx].ReadSelected = true;
      }
    }
    this.SavedMenu = this.DataForUserGroup.OPTM_ADMIN_AUTHRUSER;
    //this.SavedMenu = tempArr;

    for(let i=0; i<this.LocalUserGrid.length; i++){
      let UserArr = [];
      UserArr = this.SavedMenu.filter(val => val.OPTM_USERCODE == this.LocalUserGrid[i].UserCode); 
      this.oSaveUserScreenModel.push(UserArr);
    }

    this.Loading = false;

    this.getMenuGridForSelectedUser();
  }

  getMenuGridForSelectedUser(){ 
    this.MenuGrid = [];   
    let arr = [];    
    if(this.selectedUser != ''){
      for(let i=0; i< this.oSaveUserScreenModel.length; i++){
        arr = this.oSaveUserScreenModel[i].filter(val => val.OPTM_USERCODE == this.selectedUser);   
        if(arr.length>0){
          this.MenuGrid = arr;
        }   
      } 
      if(this.MenuGrid.length == 0){
        this.getMenuList('show');
      } 
    }     
      
  }

  setCheckBoxVal(arr){
    for(let i=0; i<arr.length; i++){
      if(arr[i].AddSelected == '')
      arr[i].AddSelected = false;
      if(arr[i].UpdateSelected == '')
      arr[i].UpdateSelected = false;
      if(arr[i].DeleteSelected == '')
      arr[i].DeleteSelected = false;
      if(arr[i].ReadSelected == '')
      arr[i].ReadSelected = false;
    }
    this.MenuGrid = arr;
  }

  getMenuList(state){
    
    this.oModalData.SelectedRole = [];

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
    this.Loading = true;
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
         this.screenGrid[i].OPTM_USERCODE = this.selectedUser;
      } 
     
      this.oSaveUserScreenModel.push(this.screenGrid);
      if(this.selectedUser != ''){
        let arr = [];
        for(let i=0; i< this.oSaveUserScreenModel.length; i++){
        arr = this.oSaveUserScreenModel[i].filter(val => val.OPTM_USERCODE == this.selectedUser);   
        if(arr.length>0){
          this.MenuGrid = arr;
        }   
      }        
     }      
      this.Loading = false;       
    },    
      error => {  
        this.Loading = false;
        if(error.error != null && error.error != undefined){
          if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
            this.commonService.unauthorizedToken(error);               
          }
        }
        else{
          this.MessageService.errormessage(error.message);
        }
    }); 
  }
 }

 editUser($event){
  this.selectedUser = '';
  //this.getAllUserGroup();
  let userGrp ;
  if($event.selectedRows.length > 0){
     userGrp = $event.selectedRows[0].dataItem.OPTM_USERGROUP;
     this.UserGroup = $event.selectedRows[0].dataItem.OPTM_USERGROUP;
     this.getUserForLookup();
  }   
  else{
     userGrp = $event.selectedRows[0].dataItem.OPTM_USERGROUP;    
  }   
    
  this.isEdit = true;
  this.addAuthScreenToggle('edit');
   
  this.AuthServ.GetDataForUserGroup(userGrp).subscribe(
    data => {    
        this.DataForUserGroup = data;
        console.log(this.allUsersDDL);
        this.ddlUserGroup = this.allUsersDDL.filter(val => val.OPTM_GROUPCODE == userGrp);
        this.defaultItem = this.ddlUserGroup[0];

        this.showDisplayBtn = true;  

        if(this.DataForUserGroup.OPTM_ADMIN_AUTHRUSER.length > 0){
          this.getSavedUser();        
          if(this.LocalUserGrid.length > 0){
            this.selectedUser = this.LocalUserGrid[0].UserCode;
            let select = [];       
            select.push(this.selectedUser);
            this.isUserCodeSelected = (e: RowArgs) => select.indexOf(e.dataItem.UserCode) >=0 ;  
          }        
        } 
        this.getRoles('edit');  
    },    
    error => {
      this.Loading = false;  
      if(error.error != null && error.error != undefined){
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
      }
      else{
        this.MessageService.errormessage(error.message);
      }
  });
}

getSavedUser(){
  this.Loading = true;
  this.LocalUserGrid = [];  
  for(let i=0; i<this.DataForUserGroup.OPTM_ADMIN_AUTHRUSER.length; i++){
    if(this.LocalUserGrid.length > 0){
      const index = this.LocalUserGrid.findIndex(r=>r.UserCode == this.DataForUserGroup.OPTM_ADMIN_AUTHRUSER[i].OPTM_USERCODE);
      if(index == -1){
        this.LocalUserGrid.push({
          UserCode: this.DataForUserGroup.OPTM_ADMIN_AUTHRUSER[i].OPTM_USERCODE
        });
      }    
    } 
    else{
      this.LocalUserGrid.push({
        UserCode: this.DataForUserGroup.OPTM_ADMIN_AUTHRUSER[i].OPTM_USERCODE
      });
    }   
  }  
  this.Loading = false;    
}

 saveRecord(){  

  let checkRoleSelected = this.gridDataRoles.filter(item => item.checked == true);
  if(checkRoleSelected.length == 0)
  {
    this.MessageService.errormessage(this.translate.instant('Select_One_Product'));
    return;
  }

  var oSaveModel:any = {};
  oSaveModel.OPTM_ADMIN_AUTHR = [];
  oSaveModel.OPTM_ADMIN_AUTHRUSER = [];   
  
   if(this.isEdit === true){
    let userGroup = this.UserGroup;
    //let inputVal = this.inputVal;
    let selectedUser = this.selectedUser;
    let DataForUserGroup = this.DataForUserGroup;  
    let saveRoleData = this.gridDataRoles.map(function(obj) {
      if(obj.checked == true){
        oSaveModel.OPTM_ADMIN_AUTHR.push({
          OPTM_USERGROUP : userGroup,
          OPTM_ROLEID : obj.OPTM_ROLEID,
          OPTM_CREATEDATE : '000-00-00',
          OPTM_USERID : 'admin',
          OPTM_AUTHCODE: obj.OPTM_AUTHCODE
      });
      }
      return obj; 
    });

    this.Loading = true;      

     for (let idx1 = 0; idx1 < this.oSaveUserScreenModel.length; idx1++) {
       let saveUserGridData = this.oSaveUserScreenModel[idx1].map(function (obj) {
         oSaveModel.OPTM_ADMIN_AUTHRUSER.push({
           OPTM_USERGROUP: DataForUserGroup.OPTM_ADMIN_AUTHR[0].OPTM_USERGROUP,
           OPTM_ROLEID: obj.OPTM_ROLEID,
           OPTM_MENUID: obj.OPTM_MENUID,
           OPTM_PERMISSION: obj.OPTM_PERMISSION,
           OPTM_CREATEDATE: '000-00-00',
           //OPTM_USERCODE: DataForUserGroup.OPTM_ADMIN_AUTHR[0].OPTM_USERGROUP,
           OPTM_USERCODE: obj.OPTM_USERCODE,
           AddSelected: (obj.AddSelected == undefined || obj.AddSelected == "") ? false : obj.AddSelected,
           UpdateSelected: (obj.UpdateSelected == undefined || obj.UpdateSelected == "") ? false : obj.UpdateSelected,
           DeleteSelected: (obj.DeleteSelected == undefined || obj.DeleteSelected == "") ? false : obj.DeleteSelected,
           ReadSelected: (obj.ReadSelected == undefined || obj.ReadSelected == "") ? false : obj.ReadSelected,
           OPTM_USERID: 'admin',
           OPTM_AUTHCODE: obj.OPTM_AUTHCODE
         });
         return obj;
       });
     }

     this.AuthServ.AddPermission(oSaveModel).subscribe(
       data => {
         if (data == "True") {
           this.translate.get('Operation_Update_MSG').subscribe((res: string) => {
             this.MessageService.successmessage(res);
           });
           this.addAuthScreenToggle('edit');
           this.confirmationOpenedEdit = false;
         }
         else {
           this.MessageService.errormessage(data);
         }
         this.Loading = false;
       },
       error => {
         this.Loading = false;
         if (error.error != null && error.error != undefined) {
           if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
             this.commonService.unauthorizedToken(error);
           }
         }
         else {
           this.MessageService.errormessage(error.message);
         }
       });  
   }else{
    let userGroup = this.UserGroup;
    //let inputVal = this.inputVal;  
    let selectedUser = this.selectedUser;
    let saveRoleData = this.gridDataRoles.map(function(obj) {
      if(obj.checked == true){
        oSaveModel.OPTM_ADMIN_AUTHR.push({
          OPTM_USERGROUP : userGroup,
          OPTM_ROLEID : obj.OPTM_ROLEID,
          OPTM_CREATEDATE : '000-00-00',
          OPTM_USERID : 'admin'
      });
      }
      return obj; 
    });

    for(let idx=0; idx<this.oSaveUserScreenModel.length; idx++){
      let saveUserGridData = this.oSaveUserScreenModel[idx].map(function(obj1) {
        oSaveModel.OPTM_ADMIN_AUTHRUSER.push({
          OPTM_USERGROUP : userGroup,
          OPTM_ROLEID : obj1.OPTM_ROLEID,
          OPTM_MENUID : obj1.OPTM_MENUID,
          OPTM_PERMISSION : obj1.OPTM_PERMISSION,
          OPTM_CREATEDATE : "000-00-00",
          //OPTM_USERCODE : inputVal,
          OPTM_USERCODE : obj1.OPTM_USERCODE,
          AddSelected: (obj1.AddSelected == undefined || obj1.AddSelected == "") ? false: obj1.AddSelected,
          UpdateSelected: (obj1.UpdateSelected == undefined || obj1.UpdateSelected == "") ? false: obj1.UpdateSelected,
          DeleteSelected: (obj1.DeleteSelected == undefined || obj1.DeleteSelected == "") ? false: obj1.DeleteSelected,
          ReadSelected: (obj1.ReadSelected == undefined || obj1.ReadSelected == "") ? false: obj1.ReadSelected,
          OPTM_USERID: "admin"
        });
        return obj1; 
     });
     }
    

    this.Loading = true;    
    this.AuthServ.AddPermission(oSaveModel).subscribe(
      data => { 
        if(data == "True"){
            this.translate.get('Operation_Complete_MSG').subscribe((res: string) => {
            this.MessageService.successmessage(res);
          }); 
          
          this.addAuthScreenToggle('Cancel');
          this.getPermissionView();
        }
        else{
          this.MessageService.errormessage(data);
        }
        
        this.Loading = false;    
      },    
      error => { 
        this.Loading = false;     
        if(error.error != null && error.error != undefined){
          if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
            this.commonService.unauthorizedToken(error);               
          }
        }
        else{
          this.MessageService.errormessage(error.message);
        }
    });
   }
}

public confirmationToggle() {
   this.confirmationOpened = !this.confirmationOpened;
}

deleteRecord(){
  this.Loading = true;
  this.AuthServ.DeletePermission(this.UserGroup).subscribe(
    data => { 
      this.confirmationOpened=false;
      this.dialogOpened=false;
      this.Loading = false;
      this.translate.get('Record_deleted').subscribe((res: string) => {
        this.MessageService.successmessage(res);
        this.addAuthScreenToggle('Cancel');
        this.getPermissionView();
      });

    },    
    error => { 
      this.confirmationOpened=false;
      this.dialogOpened=false; 
      this.Loading = false;
      if(error.error != null && error.error != undefined){
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
      }
      else{
        this.MessageService.errormessage(error.message);
      }
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

 userSelection($event){
 
  if(this.selectedUser != ''){
  if(this.oSaveUserScreenModel.length > 0){
    for(let i=0; i<this.oSaveUserScreenModel.length;i++){
     const index = this.oSaveUserScreenModel[i].findIndex(val => val.OPTM_USERCODE === this.selectedUser); 
     if(index != -1 ){
      this.oSaveUserScreenModel[i] = this.MenuGrid;
     }            
    }   
  }
 }
  
  this.MenuGrid =[];  
  this.selectedUser = $event.selectedRows[0].dataItem.UserCode;
     
  let select = [];       
  select.push(this.selectedUser);
  this.isUserCodeSelected = (e: RowArgs) => select.indexOf(e.dataItem.UserCode) >=0 ;  

  if(this.isEdit){
    this.getMenuGridForSelectedUser();
  }
  else{
    this.getMenuList('show');
  }    
 }

  displayMenu(event){   
     if(event == 'Arrow'){
      if(this.inputVal != ''){
        this.LocalUserGrid.push({
          UserCode: this.inputVal
        });
      this.selectedUser = this.inputVal;
      this.inputVal = '';
      }  

      if(this.LocalUserGrid.length > 0){
        let select = [];       
        select.push(this.selectedUser);
        this.isUserCodeSelected = (e: RowArgs) => select.indexOf(e.dataItem.UserCode) >=0 ;  
      }
    }    

    if(this.isEdit){
      this.getMenuGridForSelectedUser();
    }
    else{
      this.getMenuList('show');      
    }
     
  }

  deleteMenu(rowIndex,dataItem){ 
    
    //this.MenuGrid = [];
    // if(this.LocalUserGrid[rowIndex+1].UserCode == this.selectedUser){
    //   this.selectedUser = this.LocalUserGrid[rowIndex+1].UserCode;  
    //   for(let i=0; i<this.oSaveUserScreenModel.length;i++){
    //     const index1 = this.oSaveUserScreenModel[i].findIndex(val => val.OPTM_USERCODE === this.selectedUser);
    //      if(index1 != -1 ){
    //       this.MenuGrid = this.oSaveUserScreenModel[i];
    //      }
    //   }    
    // }

    if(this.oSaveUserScreenModel.length > 0){
      for(let i=0; i<this.oSaveUserScreenModel.length;i++){
       const index = this.oSaveUserScreenModel[i].findIndex(val => val.OPTM_USERCODE === dataItem.UserCode); 
       if(index != -1 ){
        this.oSaveUserScreenModel.splice(i,1);
       }
      }   
    }

    this.LocalUserGrid.splice(rowIndex,1); 
    
    if(this.LocalUserGrid[rowIndex+1] == undefined){
      this.selectedUser = '';
      this.MenuGrid = [];
      let select = [];
      // if(this.selectedUser == dataItem.UserCode)
      // select.push(this.LocalUserGrid[0].UserCode);
      // else
      // select.push(this.selectedUser);
      select.push(this.selectedUser);
      this.isUserCodeSelected = (e: RowArgs) => select.indexOf(e.dataItem.UserCode) >=0 ;
    }

    // if(this.LocalUserGrid.length > 10){
    //   this.showGridUserPage = true;
    // }
    // else{
    //   this.showGridUserPage = true;
    // }
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
    
    let arr = [];
    for(let i=0; i< this.oSaveUserScreenModel.length; i++){
      arr = this.oSaveUserScreenModel[i].filter(val => val.OPTM_USERCODE == this.selectedUser);   
      if(arr.length>0){
        if(isCheck)
          arr[idx].AddSelected = true;
        else
          arr[idx].AddSelected = false;
          this.oSaveUserScreenModel[i] =  arr;
      }   
    } 

    if(isCheck)
    this.MenuGrid[idx].AddSelected = true;
    else
    this.MenuGrid[idx].AddSelected = false;
  }

  updateSelectChange(isCheck,idx){

    let arr = [];
    for(let i=0; i< this.oSaveUserScreenModel.length; i++){
      arr = this.oSaveUserScreenModel[i].filter(val => val.OPTM_USERCODE == this.selectedUser);   
      if(arr.length>0){
        if(isCheck)
          arr[idx].UpdateSelected = true;
        else
          arr[idx].UpdateSelected = false;
        this.oSaveUserScreenModel[i] =  arr;
      }   
    } 

    if(isCheck)
    this.MenuGrid[idx].UpdateSelected = true;
    else
    this.MenuGrid[idx].UpdateSelected = false;
  }

  deleteSelectChange(isCheck,idx){
    let arr = [];
    for(let i=0; i< this.oSaveUserScreenModel.length; i++){
      arr = this.oSaveUserScreenModel[i].filter(val => val.OPTM_USERCODE == this.selectedUser);   
      if(arr.length>0){
        if(isCheck)
          arr[idx].DeleteSelected = true;
        else
          arr[idx].DeleteSelected = false;
        this.oSaveUserScreenModel[i] =  arr;
      }   
    } 

    if(isCheck)
    this.MenuGrid[idx].DeleteSelected = true;
    else
    this.MenuGrid[idx].DeleteSelected = false;
  }

  readSelectChange(isCheck,idx){

    let arr = [];
    for(let i=0; i< this.oSaveUserScreenModel.length; i++){
      arr = this.oSaveUserScreenModel[i].filter(val => val.OPTM_USERCODE == this.selectedUser);   
      if(arr.length>0){
        if(isCheck)
          arr[idx].ReadSelected = true;
        else
          arr[idx].ReadSelected = false;
          this.oSaveUserScreenModel[i] =  arr;
      }   
    }

    if(isCheck)
     this.MenuGrid[idx].ReadSelected = true;
    else
     this.MenuGrid[idx].ReadSelected = false;
  }

  
  onInput(filter) {    
    this.gridData = filterBy(this.FilterData, {     
     field:'OPTM_USERGROUP',     
     operator: 'contains',
     value: filter,    
    }); 
  }
  
}


