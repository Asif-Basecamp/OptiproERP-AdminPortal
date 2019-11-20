import { Component, OnInit } from '@angular/core';
import { products } from '../../dummyData/data';
import { GridComponent, RowClassArgs } from '@progress/kendo-angular-grid';
import { AuthorizationService } from '../../service/authorization.service';
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

  constructor(private AuthServ: AuthorizationService, private MessageService:MessageService, private translate: TranslateService, private httpClientSer: HttpClient) {
    translate.use(localStorage.getItem('applang'));
      translate.onLangChange.subscribe((event: LangChangeEvent) => { 
    }); 
  }

  ngOnInit() {
    this.translate.get('Select_User_Group').subscribe((res: string) => {
      this.user_select = res;
    }); 
    this.getPermissionView();
    this.oModalData.User = [];
    this.oModalData.SelectedRole = []; 
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
    this.AuthServ.getPermissionView().subscribe(
      data => {
        this.gridData = data; 
      },    
      error => {  
        this.MessageService.errormessage(error.message);
    }); 
  }

  /*-- get list of users on click search icon --*/
  getUserForLookup(){
    this.AuthServ.getUsers(this.UserGroup).subscribe(
      data => {  
        this.userGridLookup = data.USERDETAILS; 
      },    
      error => {  
        this.MessageService.errormessage(error.message);
    });
  }

  /*-- get list of user group --*/
  getAllUserGroup(){
    this.AuthServ.getUserGroup().subscribe(
      data => {
        this.allUsersDDL = data;         
      },    
      error => {  
        this.MessageService.errormessage(error.message);
    });
  }

  /*-- condition of add or edit screen --*/
  public addAuthScreenToggle(mode) {
    this.addAuthScreen = !this.addAuthScreen;
    this.inputRole = [];
    if(this.addAuthScreen){
      if(mode == 'edit'){
        this.getAllUserGroup();       
      } 
      else{
        this.UserGroup = this.user_select;
        this.defaultItem = '';
        this.getRoles(mode);
      }          
      this.getUserGroup();
    }
    if(mode == 'add'){
      this.isEdit = false;
      this.inputVal = '';     
      this.userGridLookup = []; 
      this.screenGrid = [];
      this.LocalUserGrid = [];
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
      // this.defaultItem = this.ddlUserGroup[0];       
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

  gridUserSelection($event){
    this.inputVal = $event.selectedRows[0].dataItem.OPTM_USERCODE;    
    if(this.LocalUserGrid.length > 0){
      var index = this.LocalUserGrid.findIndex(r=>r.UserCode == this.inputVal); 
      if(index != -1){
       // this.MessageService.errormessage("User is already selected! Please select another user");
       alert("User is already selected! Please select another user");
        this.inputVal = '';
        return;
      }    
    }  
    
    // if(index == -1){
    //   this.LocalUserGrid.push({
    //     UserCode: this.inputVal
    //   });
    // } 
    this.CheckUserPermissionForProduct('grid'); 
  }

  CheckUserPermissionForProduct(area){
    this.oModalData.User = [];
    this.oModalData.User.push({
      User: this.inputVal
    })
    this.AuthServ.checkUserPermissionForProduct(this.oModalData).subscribe(
    data => { 
      if(data != 'exist'){
        this.MessageService.errormessage(data);
        this.screenGrid = [];
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

  getMenuList(state){
  // if(state != 'show'){
    for(let i=0; i < this.inputRole.length; i++){
      for(let j=0; j < this.gridDataRoles.length; j++){
        if(this.inputRole[i].OPTM_ROLEID == this.gridDataRoles[j].OPTM_ROLEID){

          // let idx = this.oModalData.SelectedRole.findIndex(r=>r.Product == this.inputRole[i].OPTM_ROLEID);
          // if(this.oModalData.SelectedRole.length > 0){
          
          // }          

          this.oModalData.SelectedRole.push({
              Product: this.gridDataRoles[j].OPTM_PROD
          })         
        }
      }
    }
  //} 
  
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

 editUser($event){
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
        this.ddlUserGroup = this.allUsersDDL.filter(val => val.OPTM_GROUPCODE == userGrp);
        this.defaultItem = this.ddlUserGroup[0];
        this.inputVal = userGrp;
        this.selectedUser = this.inputVal;
        this.showDisplayBtn = true;  
        this.getRoles('edit');      
    },    
    error => {  
      this.MessageService.errormessage(error.message);
  });
}


 saveRecord(){  
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
          OPTM_USERID : 'admin'
      });
      }
      return obj; 
    });

    let saveUserGridData = this.screenGrid.map(function(obj) {
      const index = DataForUserGroup.OPTM_ADMIN_AUTHRUSER.findIndex(r=>r.OPTM_MENUID == obj.OPTM_MENUID);
    
      oSaveModel.OPTM_ADMIN_AUTHRUSER.push({
        OPTM_USERGROUP: DataForUserGroup.OPTM_ADMIN_AUTHR[0].OPTM_USERGROUP,
        OPTM_ROLEID: obj.OPTM_ROLEID,
        OPTM_MENUID: obj.OPTM_MENUID,
        OPTM_PERMISSION: obj.OPTM_PERMISSION,
        OPTM_CREATEDATE: '000-00-00',
        OPTM_USERCODE: DataForUserGroup.OPTM_ADMIN_AUTHR[0].OPTM_USERGROUP,
        AddSelected: obj.AddSelected,
        UpdateSelected: obj.UpdateSelected,
        DeleteSelected: obj.DeleteSelected,
        ReadSelected: obj.ReadSelected,
        OPTM_USERID: 'admin',
      });
      return obj; 
    });

    this.AuthServ.AddPermission(oSaveModel).subscribe(
      data => { 
        if(data == "True"){
         this.translate.get('Operation_Update_MSG').subscribe((res: string) => {
            this.MessageService.successmessage(res);
          }); 
          this.addAuthScreenToggle('edit');
        }
        else{
          this.MessageService.errormessage(data);
        }
      },    
      error => {  
        this.MessageService.errormessage(error.message);
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

    let saveUserGridData = this.screenGrid.map(function(obj) {
      oSaveModel.OPTM_ADMIN_AUTHRUSER.push({
        OPTM_USERGROUP : userGroup,
        OPTM_ROLEID : obj.OPTM_ROLEID,
        OPTM_MENUID : obj.OPTM_MENUID,
        OPTM_PERMISSION : obj.OPTM_PERMISSION,
        OPTM_CREATEDATE : "000-00-00",
        //OPTM_USERCODE : inputVal,
        OPTM_USERCODE : selectedUser,
        AddSelected: obj.AddSelected,
        UpdateSelected: obj.UpdateSelected,
        DeleteSelected: obj.DeleteSelected,
        ReadSelected: obj.ReadSelected,
        OPTM_USERID: "admin"
      });
      return obj; 
    });

    this.AuthServ.AddPermission(oSaveModel).subscribe(
      data => { 
        if(data == "True"){
          this.translate.get('Operation_Complete_MSG').subscribe((res: string) => {
            this.MessageService.successmessage(res);
          }); 
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
      });   
    },    
    error => { 
      this.confirmationOpened=false;
      this.dialogOpened=false; 
      this.Loading = false;
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

  displayMenu(event){   
    if(event == 'Arrow'){
      if(this.inputVal != ''){
        this.LocalUserGrid.push({
          UserCode: this.inputVal
        });
      this.selectedUser = this.inputVal;
      this.inputVal = '';
      }     
      
    }
    else{
      this.selectedUser = event.selectedRows[0].dataItem.UserCode;
    }  

    this.getMenuList('show');
  }

  deleteMenu(rowIndex,dataItem){
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


