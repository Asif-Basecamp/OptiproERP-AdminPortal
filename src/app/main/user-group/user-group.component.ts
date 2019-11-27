import { Component, OnInit } from '@angular/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { UsergroupService } from '../../service/usergroup.service'; 
import { MessageService } from '../../common/message.service'; 
import { filterBy, FilterDescriptor } from '@progress/kendo-data-query';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonService } from 'src/app/service/common.service';
@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.scss']

})
export class UserGroupComponent implements OnInit {
  model : any={};  
  IsDuplicate: boolean=false;
  HeaderText:string="";
  selectedItem: string = ""; 
  // public paginationButtonCount = 5;
  // public paginationInfo = true;
  // public paginationType: 'input';
  // public paginationPageSizes = true;
  // public paginationInfoPreviousNext = true;
  public dialogOpened = false;
  public confirmationOpened = false;
  public confirmationOpenedEdit = false;
  public enableSubmit= false;
  // public enableEdit = false;
  public enableUpdate= false;
  public enableDelete = false;
  public IsGroupCode= true;
  // public Ugroup= true;
  // public UDesc = true;
  // public UUser= true;
  // public UPwd = true;
  public EditMode :boolean = false;
  public IsCancelClick :boolean = false;
  public AdminEnable=true;
  public gridData: any[];
  public FilterData: any[];
  public DropDownListData: any[];
  public ddlUserType: any[];
  public searchText : string;
  public Loading: boolean = false;
  constructor(private UserGroupService:UsergroupService, private MessageService:MessageService,
    private translate: TranslateService, private httpClientSer: HttpClient,private commonService: CommonService) {
      // let userLang = navigator.language.split('-')[0];
      //   userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
      translate.use(localStorage.getItem('applang'));
        translate.onLangChange.subscribe((event: LangChangeEvent) => { 
        }); 
    
   }    

  ngOnInit() {
    
    this.FillGrid();
    this.ddlUserType=[];
    this.ddlUserType.push(
      { text: "Customer", value: "C" }, 
      { text: "Employee", value: "E" }, 
      { text: "Vendor", value: "V" }  
         
    );
    
  }
  clearForm(model: any) {
    this.model = {
      UserGroupId:"",
      UserGroupDesc: "",
      mapped_Password: "",
      IsAdminEnabled: "",
      USER_CODE: "",
      mapped_user:""
    };
     
    }   
   
  FillGrid()
  {
    this.Loading=true;
    this.UserGroupService.GetUserGroupGridData(this.model).subscribe(    
      data => {  
        //if(data.Status=="Success") 
        if(data.length>0) 
        {     
          this.gridData = data;
          this.FilterData=data;
          this.Loading=false;
        }    
        else{ this.MessageService.errormessage(this.translate.instant('UserMgmtSomethimgWntWrngMsg'));  
        this.Loading=false;  
        }    
      },    
      error => {
        
        this.Loading=false;
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
        else{
          this.MessageService.errormessage(error.message);   
        }
        
      });
   // this.gridData = UsergroupService;
    // this.isMobile();
  }
  SaveData()
  {
    this.Loading=true;
    this.UserGroupService.AddUser(this.model).subscribe(    
      data => {    
        if(data==1)   
        {     
         this.FillGrid()
         this.dialogOpened=false;
         this.Loading=false;
        }    
        else{ 
        this.MessageService.errormessage(this.translate.instant('UserMgmtSomethimgWntWrngMsg'));   
        this.Loading=false; 
        }    
      },    
      error => {
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
        else{
          this.MessageService.errormessage(error.message);   
        }
       // this.MessageService.errormessage(error.message); 
        this.Loading=false;   
      });
   
  }
  Update()
  {
    this.Loading=true;
    this.UserGroupService.UpdateUser(this.model).subscribe(    
      data => {    
        if(data==1)   
        {     
         this.FillGrid()
        this.dialogOpened=false;
        this.Loading=false;
        }    
        else{ this.MessageService.errormessage(this.translate.instant('UserMgmtSomethimgWntWrngMsg'));    
        this.Loading=false;
        }    
      },    
      error => {
        this.Loading=false;
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
        else{
          this.MessageService.errormessage(error.message);   
        }
        //this.MessageService.errormessage(error.message);   
       
      });
  }
  UpdateData(Type)
    {
      //this.Loading=false;
      if(this.model.PreviousGrpId !=this.model.UserGroupId)
      {
      if(this.IsDuplicate==false)
        {
          this.Update()
           if(Type==='Cancel')
          this.confirmationEditToggle();
        }
        else{
          this.MessageService.errormessage(this.translate.instant('UGalreadyExist'));
        }
      }
      else
      {
      this.Update()
      if(Type==='Cancel')
      this.confirmationEditToggle();
      }
    };

  ChkUserGroupAssociativity()
  {
    this.Loading=true;
    this.UserGroupService.ChkUserGroupAssociativity(this.model).subscribe(    
      data => {    
      
        if(data.length > 0) 
        {
          if(data[0].UserGroupCount==0)
          {
            this.DeleteData()     
            
            this.confirmationOpened=false;
            this.dialogOpened=false;
            this.Loading=false;
          }
          else{ 
            this.confirmationOpened=false;
            this.dialogOpened=false;
            this.MessageService.errormessage(this.translate.instant('UGallocated'));  
            this.Loading=false;
          }
        
        }    
        else
        { 
         
          this.MessageService.errormessage(this.translate.instant('UserMgmtSomethimgWntWrngMsg')); 
          this.Loading=false;   
        }    
      },    
      error => {
        //this.MessageService.errormessage(error.message);   
        this.Loading=false;
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
        else{
          this.MessageService.errormessage(error.message);   
        }
      });
   
  }

  DeleteData()
  {
    this.Loading=true;
    this.UserGroupService.DeleteUser(this.model).subscribe(    
      data => {     
        // if(data==1)   
        // {     
         this.FillGrid()
         this.confirmationOpened=false;
         this.dialogOpened=false;
         this.Loading=false;
        // }    
        // else{ this.MessageService.errormessage("Something went wrong..");    
        // }    
      },    
      error => {
        //this.MessageService.errormessage(error.message); 
        this.Loading=false;  
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
        else{
          this.MessageService.errormessage(error.message);   
        }
      });
   
  }
  onChange(UserGrpId: string) {
    this.IsDuplicate=false;
    if(this.model.PreviousGrpId==UserGrpId)
    return
    this.Loading=true;
    this.UserGroupService.CheckDuplicateUserGroup(UserGrpId).subscribe(    
      data => { 
        if(data.length > 0) 
        {
          if(data[0].GroupCodeCount==1)
          {
            this.MessageService.errormessage(this.translate.instant('UGalreadyExist'));
            //DuplicateUserGroupId
            this.IsDuplicate=true;
            this.Loading=false;
          }
          else
          {
            this.IsDuplicate=true;
            this.Loading=false;
          }  
        }    
        else{    
         this.MessageService.errormessage(this.translate.instant('UserMgmtSomethimgWntWrngMsg'));
         this.Loading=false;
        }    
      },    
      error => {    
        //this.MessageService.errormessage(error.message);
        this.Loading=false;
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
        else{
          this.MessageService.errormessage(error.message);   
        }
      });
};

FillDropdownList()
  {
     this.UserGroupService.FillDropDownList().subscribe(    
      data => {    
            
        if(data.length > 0) 
        {  
         this.DropDownListData = data; 
        }    
        else{    
          this.MessageService.errormessage(this.translate.instant('UserMgmtSomethimgWntWrngMsg'));    
        }    
      },    
      error => {  
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
        else{ 
          this.MessageService.errormessage(error.message);  
        }
        //this.MessageService.errormessage(error.message);   
      });
  }
  CancelData()
    {
     
      if(this.EditMode)
      {
        
        this.confirmationEditToggle();
        //this.dialougeToggle();
      }
      else this.dialougeToggle('');
    }
  gridUserSelectionChange(gridUser, selection) {
    
    this.Loading=true;
    
    const GroupCodeData= selection.selectedRows[0].dataItem.OPTM_GROUPCODE
    
    if(GroupCodeData==='admin')
      {
        this.MessageService.errormessage(this.translate.instant('DisableUpdatePermission'));
      }
      else(this.dialougeToggle(''))
      //this.dialougeToggle('');
    this.EditMode=true;
    this.UserGroupService.GetDataByUserId(GroupCodeData).subscribe(    
      data => { 
       this.HeaderText= "Edit -" +' '+  data[0].OPTM_GROUPCODE;
        if(data.length > 0) 
        { 
         this.model = {
         
          UserGroupId: data[0].OPTM_GROUPCODE,
          UserGroupDesc: data[0].OPTM_DESCRIPTION,
          mapped_Password: data[0].OPTM_SAPPASSWORD,
          IsAdminEnabled: data[0].OPTM_ISADMIN,
          mapped_user: data[0].OPTM_SAPUSER,
          PreviousGrpId:selection.selectedRows[0].dataItem.OPTM_GROUPCODE
        };
        // this.enableEdit=true;  
        this.enableDelete=true; 
        this.enableUpdate=true; 
        this.enableSubmit=false;
        this.IsGroupCode=false;
        this.Loading=false;
       // this.EditMode=true
        // this.Ugroup=false;  
        // this.UDesc=false;  
        // this.UUser=false;  
        // this.UPwd=false;
        this.AdminEnable=false;
        }  
         else if(data.Status =="Unauthorized")
         {
          this.MessageService.errormessage(this.translate.instant('Unauthorized'));
          this.Loading=false;
         }
        else{ this.MessageService.errormessage(this.translate.instant('UserMgmtSomethimgWntWrngMsg')); 
        this.Loading=false;   
        }    
      },    
      error => {
        //this.MessageService.errormessage(error.message);   
        this.Loading=false;
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
        else{
          this.MessageService.errormessage(error.message);   
        }
      });
}
  onFilterChange(checkBox:any,grid:GridComponent){
    if(checkBox.checked==false){
      this.clearFilter(grid);
    }
  }
  
  onInput(filter) {
    
    this.gridData = filterBy(this.FilterData, {
     
      field:'OPTM_GROUPCODE',
      operator: 'contains',
     value: filter,
    //   filters: [
    //     { field: "OPTM_GROUPCODE", operator: "contains", value: filter },
    //     { field: "OPTM_DESCRIPTION", operator: "contains", value:filter },
    // ]
    }); 
  }
  clearFilter(grid:GridComponent){      
    grid.filter.filters=[];
  }

  // public isMobile(): void {
  //   if(window.innerWidth <= 991){
  //     // this.paginationInfo = false;
  //     this.paginationPageSizes = false; 
  //     this.paginationInfoPreviousNext = false;  
  //     this.paginationButtonCount = 3;                 
  //   }
  // }

  public dialougeToggle(Type) {
    
    if(Type==='Cancel') 
     {
      this.confirmationEditToggle();
     }
    this.HeaderText= "Add New";
    this.FillDropdownList()
    this.clearForm(this.model)
    this.model.IsAdminEnabled = false;
    this.dialogOpened = !this.dialogOpened;
    this.enableSubmit=true;
    this.AdminEnable=true; 
    this.enableDelete=false; 
    this.enableUpdate=false; 
    this.enableSubmit=true; 
    this.IsGroupCode=true;
    this.EditMode=false;
    
  }
  public confirmationToggle() {
    this.confirmationOpened = !this.confirmationOpened;
  }
  public confirmationEditToggle() {
    this.confirmationOpenedEdit = !this.confirmationOpenedEdit;
  }
  EnableFields()
  {
    this.AdminEnable=true;  
    this.enableDelete=false; 
    this.enableUpdate=true;
  }
}
