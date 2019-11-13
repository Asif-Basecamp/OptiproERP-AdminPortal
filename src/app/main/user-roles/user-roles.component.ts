import { Component, OnInit } from '@angular/core';
import { GridComponent, SelectableSettings, RowArgs } from '@progress/kendo-angular-grid';
import { RoleService } from '../../service/role.service'; 
import { MessageService } from '../../common/message.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { filterBy } from '../../../../node_modules/@progress/kendo-data-query';
@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})

export class UserRolesComponent implements OnInit {
  model : any={};
  selectedItem: string = ""; 
  public gridData1: any[]=[];
  public GridDataFormanupulation: any[];
  IsDuplicate :boolean=false;
  HeaderText:string="";
  public addRolesScreen = false;
  public gridData: any[];
  public checkboxOnly = false;
  public DropDownListData: any[];
  public AddSelected :boolean=false;
  public UpdateSelected :boolean=false;
  public DeleteSelected :boolean=false;
  public ReadSelected :boolean=false;
  public SelectedRowData:any[]=[];
  public NewSelectedRowData: any[] = [];
  public EditMode :boolean=false;
  public Loading :boolean=false;
  public enableSubmit= false;
  public enableEdit = false;
  public enableUpdate= false;
  public enableDelete = false;
  public IsRoleId= true;
  public IsRoleDesc = true;
  public IsProduct= true;
  public confirmationOpened = false;
  public confirmationOpenedEdit = false;
  public FilterData: any[];
  constructor(private RoleService:RoleService,private MessageService:MessageService,
    private translate: TranslateService, private httpClientSer: HttpClient) { 
          translate.use(localStorage.getItem('applang'));
          translate.onLangChange.subscribe((event: LangChangeEvent) => { 
          }); 
    
  }

  ngOnInit() {
     this.FillGridData();
    
   // this.gridData = products;
    // this.isMobile();
  }
  public confirmationEditToggle() {
   
    this.confirmationOpenedEdit = !this.confirmationOpenedEdit;
    
  }
  onInput(filter) {
    
    this.gridData = filterBy(this.FilterData, {
     
      field:'OPTM_ROLEID',
      operator: 'contains',
     value: filter,
    }); 
  }
  onFilterChange(checkBox:any,grid:GridComponent){
    if(checkBox.checked==false){
      this.clearFilter(grid);
    }
  }
   //To get all screen list after product selection
   FillFridOnDropdownSelectedIndexChanged  (ProductName) {
       
   var  TempArray  =[];
                  if (this.gridData1.length > 0) {
                        // row count of TableDataBinding
                        var iTblCount = 0;
                        var sCurrentProductSelected = this.gridData1[0].OPTM_PROD;
                        // Remove Rows of current selected Product
                        for (var iSelectedTbl = 0; iSelectedTbl < this.NewSelectedRowData.length; iSelectedTbl++) {
                            if (this.NewSelectedRowData[iSelectedTbl].OPTM_PROD == sCurrentProductSelected) {
                              this.NewSelectedRowData.splice(iSelectedTbl, 1);
                                iSelectedTbl = iSelectedTbl - 1;
                            }
                        }
                        // row count of SelectedRowData
                        var iSelectedTbl = this.NewSelectedRowData.length;
                        // For each loop of all screens of a Product
                        for (iTblCount = 0; iTblCount < this.gridData1.length; iTblCount++) {

                            if (this.gridData1[iTblCount].AddSelected == true || this.gridData1[iTblCount].UpdateSelected == true || this.gridData1[iTblCount].DeleteSelected == true || this.gridData1[iTblCount].ReadSelected == true) {
                                // Select row of TableDataBinding if any checkbox is checked
                                this.NewSelectedRowData[iSelectedTbl] = this.gridData1[iTblCount];
                                // increase index value of SelectedRowData
                                iSelectedTbl = iSelectedTbl + 1;
                            }
                        }
                      }
                      TempArray=this.NewSelectedRowData;
                      
                      if(ProductName ==='')
                        {
                          ProductName=this.model.Product;
                          ProductName='';
                        }
                        this.Loading=true; 
    this.RoleService.FillFridOnDropdownSelectedIndexChanged(ProductName).subscribe(    
      data => { 
      
        if(data.length > 0)  
        {  
          this.CheckUncheckValueInsideFrid(data);   
           this.GridDataFormanupulation=data;
           // Set Checked Value 
           this.gridData1=data;
           this.gridData1.forEach(function (ProductMenu) {


            ProductMenu.AddSelected = false;
            ProductMenu.UpdateSelected = false;
            ProductMenu.DeleteSelected = false;
            ProductMenu.ReadSelected = false; 
 // public SelectedRowData:any[]=[];

        console.log(TempArray);
            //Set Checked Value 
            TempArray.forEach(function (SelectedData) {
                if (SelectedData.OPTM_MENUID == ProductMenu.OPTM_MENUID) {
                    ProductMenu.AddSelected = SelectedData.AddSelected;
                    ProductMenu.UpdateSelected = SelectedData.UpdateSelected;
                    ProductMenu.DeleteSelected = SelectedData.DeleteSelected;
                    ProductMenu.ReadSelected = SelectedData.ReadSelected;
                }
            });
        });
        this.Loading=false; 
                   
        }    
        else{    
          this.gridData1 = [];
          this.Loading=false; 
         //this.MessageService.errormessage(this.translate.instant('Somethingwrong'));
        }    
      },    
      error => {    
        this.MessageService.errormessage(error.message);
        this.Loading=false; 
      });
}
  FillDropdownList()
   {
     //if(this.SelectedRowData.length>0)
     this.RoleService.FillProductDropDownList().subscribe(    
      data => { 
        if(data.length > 0)  
        {  
         this.DropDownListData = data; 
        }    
        else{    
          this.MessageService.errormessage(this.translate.instant('Somethingwrong'));    
        }    
      },    
      error => {  
        this.MessageService.errormessage(error.message);   
      });
  }

  CheckUncheckValueInsideFrid(data)
    {
      debugger
      for(let i=0; i<data.length; i++)
      {
        data[i].AllSelected =false;
        if(data[i].AddEnabled =="True")
        data[i].AddEnabled =true;
        else  data[i].AddEnabled =false;

         if(data[i].AddSelected ==true)
         data[i].AddSelected =true;
         else  data[i].AddSelected =false;

         if(data[i].UpdateEnabled =="True")
          data[i].UpdateEnabled =true;
         else  data[i].UpdateEnabled =false;

         if(data[i].UpdateSelected ==true)
         data[i].UpdateSelected =true;
         else  data[i].UpdateSelected =false;
         
         if(data[i].DeleteEnabled =="True")
         data[i].DeleteEnabled =true;
         else  data[i].DeleteEnabled =false;

         if(data[i].DeleteSelected ==true)
         data[i].DeleteSelected =true;
         else  data[i].DeleteSelected =false;

         if(data[i].ReadEnabled =="True")
          data[i].ReadEnabled =true;
         else  data[i].DeleteEnabled =false;

         if(data[i].ReadSelected ==true)
         data[i].ReadSelected =true;
         else  data[i].ReadSelected =false;
      }  
      this.gridData1=data;
      //this.TableDataBinding=data;
      //console.log(data[0])
    }
  
      
  clearFilter(grid:GridComponent){      
    //grid.filter.filters=[];
  }

  public addRolesScreenToggle(Type) {
    this.addRolesScreen = !this.addRolesScreen;
    this.EditMode=false;
    this.enableSubmit=true;
    this.enableUpdate=false;
    this.enableDelete=false;
    this.enableEdit=false;
    this.IsRoleId=true;
    this.IsRoleDesc=true ;
    this.IsProduct=true;
    this.model.RoleId='';
    this.model.RoleDesc='';
    this.model.Product='';
    this.FillDropdownList()
    this.NewSelectedRowData=[];
    this.gridData1=[];
    if(Type==='Cancel') 
    {
     this.confirmationEditToggle();
    }
  }
  FillGridData()
    {
      this.Loading=true;
      this.RoleService.FillGridData().subscribe(    
        data => {    
             
          if(data.length > 0)  
          {   
           this.gridData = data;
           this.FilterData=data;
           this.Loading=false;
          }    
          else{    
            this.MessageService.errormessage(this.translate.instant('Somethingwrong')); 
            this.Loading=false;   
          }    
        },    
        error => {  
          this.MessageService.errormessage(error.message);   
        });
    }
  
  GetData(event,dataItem,rowIndex)
    {
      
      switch (event.currentTarget.name)   
      {   
      case'SelectAll':   
      if(event.target.attributes[1].ownerElement.checked==true)
      {
          this.GridDataFormanupulation[rowIndex].AllSelected = true;
          if(dataItem.AddEnabled==true)
          this.GridDataFormanupulation[rowIndex].AddSelected =true;
          if(dataItem.UpdateEnabled==true)
          this.GridDataFormanupulation[rowIndex].UpdateSelected = true;
          if(dataItem.DeleteEnabled==true)
          this.GridDataFormanupulation[rowIndex].DeleteSelected = true;
          this.GridDataFormanupulation[rowIndex].ReadSelected = false;
      }
      else
        {
          this.GridDataFormanupulation[rowIndex].AddSelected =false;
          this.GridDataFormanupulation[rowIndex].UpdateSelected = false;
          this.GridDataFormanupulation[rowIndex].DeleteSelected = false;
          this.GridDataFormanupulation[rowIndex].AllSelected = false;
        }   
        break;   
      case'AddEnabled':   
        if(event.target.attributes[1].ownerElement.checked==true)
        {
            if(dataItem.AddEnabled==true)
            this.GridDataFormanupulation[rowIndex].AddSelected =true;
            this.GridDataFormanupulation[rowIndex].ReadSelected = false;
            this.CheckboxSelectAll(event,dataItem,rowIndex);
            
        }
        else{this.GridDataFormanupulation[rowIndex].AllSelected = false;
          this.GridDataFormanupulation[rowIndex].AddSelected =false;}
            
          break;   
      case'UpdateEnabled':   
        if(event.target.attributes[1].ownerElement.checked==true)
          {
              if(dataItem.UpdateEnabled==true)
              this.GridDataFormanupulation[rowIndex].UpdateSelected =true;
              this.GridDataFormanupulation[rowIndex].ReadSelected = false;
              this.CheckboxSelectAll(event,dataItem,rowIndex);
              
          }
        else{this.GridDataFormanupulation[rowIndex].UpdateSelected =false;
            this.GridDataFormanupulation[rowIndex].AllSelected = false;}
            
            break;   
      case'DeleteEnabled':   
          if(event.target.attributes[1].ownerElement.checked==true)
          {
              if(dataItem.DeleteEnabled==true)
              this.GridDataFormanupulation[rowIndex].DeleteSelected =true;
              this.GridDataFormanupulation[rowIndex].ReadSelected =false;
              this.CheckboxSelectAll(event,dataItem,rowIndex);
                
          }
          else{this.GridDataFormanupulation[rowIndex].AllSelected = false;
            this.GridDataFormanupulation[rowIndex].DeleteSelected =false;}
            
            break;   
      case'ReadEnabled':   
          if(event.target.attributes[1].ownerElement.checked==true)
          {   
              this.GridDataFormanupulation[rowIndex].ReadSelected =true;
              this.GridDataFormanupulation[rowIndex].AddSelected =false;
              this.GridDataFormanupulation[rowIndex].UpdateSelected = false;
              this.GridDataFormanupulation[rowIndex].DeleteSelected = false;
              this.GridDataFormanupulation[rowIndex].AllSelected = false;
          }
          else{this.GridDataFormanupulation[rowIndex].ReadSelected =false;}
         
            break;   
      default:      
      }   
      this.gridData1=this.GridDataFormanupulation;
      
    }
     CheckboxSelectAll(event,dataItem,rowIndex)
     {
      
      switch (event.currentTarget.name)   
      {   
      
      case'AddEnabled':   
        if(event.target.attributes[1].ownerElement.checked==true)
        {
        
            if(dataItem.UpdateEnabled==true && dataItem.DeleteEnabled==true)
             { 
             if(dataItem.UpdateSelected==true && dataItem.DeleteSelected==true) 
              {
                this.GridDataFormanupulation[rowIndex].AllSelected = true;
              }
               else{this.GridDataFormanupulation[rowIndex].AllSelected = false;}
             }
             else if(dataItem.UpdateEnabled==true && dataItem.DeleteEnabled==false)
              {
                if(dataItem.UpdateSelected==true)this.GridDataFormanupulation[rowIndex].AllSelected = true;
                else this.GridDataFormanupulation[rowIndex].AllSelected = false;
              }
              else if(dataItem.UpdateEnabled==false && dataItem.DeleteEnabled==true)
              {
                if(dataItem.DeleteSelected==true)this.GridDataFormanupulation[rowIndex].AllSelected = true;
                else this.GridDataFormanupulation[rowIndex].AllSelected = false;
              }
              else{this.GridDataFormanupulation[rowIndex].AllSelected = true;}
              // End 
        }
        else{this.GridDataFormanupulation[rowIndex].AllSelected = false;
              }
            
          break;   
      case'UpdateEnabled':   
        if(event.target.attributes[1].ownerElement.checked==true)
          {
              // function start 
            if(dataItem.AddEnabled==true && dataItem.DeleteEnabled==true)
            { 
            if(dataItem.AddSelected==true && dataItem.DeleteSelected==true) 
             {
               this.GridDataFormanupulation[rowIndex].AllSelected = true;
             }
              else{this.GridDataFormanupulation[rowIndex].AllSelected = false;}
            }
            else if(dataItem.AddEnabled==true && dataItem.DeleteEnabled==false)
             {
               if(dataItem.AddSelected==true)this.GridDataFormanupulation[rowIndex].AllSelected = true;
               else this.GridDataFormanupulation[rowIndex].AllSelected = false;
             }
             else if(dataItem.AddEnabled==false && dataItem.DeleteEnabled==true)
             {
               if(dataItem.DeleteSelected==true)this.GridDataFormanupulation[rowIndex].AllSelected = true;
               else this.GridDataFormanupulation[rowIndex].AllSelected = false;
             }
             else this.GridDataFormanupulation[rowIndex].AllSelected = true;
             // End 
          }
        else{this.GridDataFormanupulation[rowIndex].UpdateSelected =false;
            this.GridDataFormanupulation[rowIndex].AllSelected = false;}
            
            break;   
      case'DeleteEnabled':   
          if(event.target.attributes[1].ownerElement.checked==true)
          {
             
              // function start 
            if(dataItem.AddEnabled==true && dataItem.UpdateEnabled==true)
            { 
            if(dataItem.AddSelected==true && dataItem.UpdateSelected==true) 
             {
               this.GridDataFormanupulation[rowIndex].AllSelected = true;
             }
              else{this.GridDataFormanupulation[rowIndex].AllSelected = false;}
            }
            else if(dataItem.AddEnabled==true && dataItem.UpdateEnabled==false)
             {
               if(dataItem.AddSelected==true)this.GridDataFormanupulation[rowIndex].AllSelected = true;
               else this.GridDataFormanupulation[rowIndex].AllSelected = false;
             }
             else if(dataItem.AddEnabled==false && dataItem.UpdateEnabled==true)
             {
               if(dataItem.DeleteSelected==true)this.GridDataFormanupulation[rowIndex].AllSelected = true;
               else this.GridDataFormanupulation[rowIndex].AllSelected = false;
             }
             else{this.GridDataFormanupulation[rowIndex].AllSelected = true;}
             // End 
              
          }
          else{this.GridDataFormanupulation[rowIndex].AllSelected = false;
            this.GridDataFormanupulation[rowIndex].DeleteSelected =false;}
            
            break;   
      
      default:      
      }   
      this.gridData1=this.GridDataFormanupulation;
      
    }

    onChange(RoleId: string) {

      this.IsDuplicate=false;
      if(this.model.PriviousRoleId==RoleId)
      return
  
      this.RoleService.CheckDuplicateUserGroup(RoleId).subscribe(    
        data => { 
            
          if(data.length > 0) 
            {
              if(data[0].CountRoleCheck>0)
                {
                  this.MessageService.errormessage(this.translate.instant('RoleIdalready'));
                  //DuplicateUserGroupId
                  this.IsDuplicate=true;
                }
              else
                {
                  this.IsDuplicate=false;
                }  
              }    
          else{    
            this.MessageService.errormessage(this.translate.instant('Somethingwrong'));
              }    
                  },    
            error => {    
              this.MessageService.errormessage(error.message);
                });
              };
  
    SaveData(gridUser)
     {
       this.onChange(this.model.RoleId);
    
       if(this.IsDuplicate==true)
       return
      
       
        // Check if TableDataBinding array have any record 
        if (this.gridData1.length > 0) {
            var sCurrentProductSelected = this.model.Product;
            // row count of SelectedRowData
            var iSelectedTbl;
            //Set Checked Value 
            // For each loop of all screens of a Product
            for (iSelectedTbl = 0; iSelectedTbl < this.NewSelectedRowData.length; iSelectedTbl++) {

                if (this.NewSelectedRowData[iSelectedTbl].OPTM_PROD == sCurrentProductSelected) {
                  this.NewSelectedRowData.splice(iSelectedTbl, 1);
                    iSelectedTbl = iSelectedTbl - 1;
                }

            }
            // row count of TableDataBinding
            var iTblCount = 0;
            // row count of SelectedRowData
            var iSelectedTbl :any;
             iSelectedTbl = this.NewSelectedRowData.length;
            // For each loop of all screens of a Product
            for (iTblCount = 0; iTblCount < this.gridData1.length; iTblCount++) {

                if (this.gridData1[iTblCount].AddSelected == true || this.gridData1[iTblCount].UpdateSelected == true || this.gridData1[iTblCount].DeleteSelected == true || this.gridData1[iTblCount].ReadSelected == true) {
                    // Select row of TableDataBinding if any checkbox is checked
                    this.NewSelectedRowData[iSelectedTbl] = this.gridData1[iTblCount];
                    // increase index value of SelectedRowData
                    iSelectedTbl = iSelectedTbl + 1;
                }
            }
        }
      
       if(this.NewSelectedRowData.length==0)  
        {
          this.MessageService.errormessage(this.translate.instant('NoRows')); 
          return
        }
        
        this.Loading=true;
      this.RoleService.AddUserRole(this.model,this.NewSelectedRowData).subscribe(    
          data => {    
              
            if(data=="True")   
            {     
              this.NewSelectedRowData=[];
              this.FillGridData();
              this.addRolesScreenToggle('');
             this.gridData1.length=0;
              this.MessageService.successmessage(this.translate.instant('RecordCreated'));
              this.Loading=false;
              
            }    
              else{ this.MessageService.errormessage(this.translate.instant('Somethingwrong'));   
              this.Loading=false; 
              }    
            },    
            error => {
              this.MessageService.errormessage(error.message);  
              this.Loading=false; 
            });
     }
     
     gridUserRoleSelectionChange(UserRole,selection) {
      this.Loading=true;
     var NewSelectedRowData = [];
      this.RoleService.GetDataByRoleId(selection.selectedRows[0].dataItem.OPTM_ROLEID).subscribe(    
        data => {
          
        //  let RoleId=this.model.RoleId;
          
          this.RoleService.chkIfGroupIdisAssociate(selection.selectedRows[0].dataItem.OPTM_ROLEID).subscribe(    
            data => { 
              
              if(data.length > 0) 
                {
                  if(data[0].ROLEIDCOUNT==0)
                    {
                      this.IsRoleId=true;
                      this.Loading=false;
                    }
                  else
                    {
                      this.IsRoleId=false;
                      this.Loading=false;
                    }  
                  }    
              else{    
                    this.MessageService.errormessage(this.translate.instant('Somethingwrong'));
                    this.Loading=false;
                  }    
                      },    
                error => {    
                  this.MessageService.errormessage(error.message);
                  this.Loading=false;
                    });
          
          console.log()
          this.addRolesScreenToggle('');
           this.model.PriviousRoleId=selection.selectedRows[0].dataItem.OPTM_ROLEID;
          this.model.RoleId=selection.selectedRows[0].dataItem.OPTM_ROLEID;
          this.model.RoleDesc=selection.selectedRows[0].dataItem.OPTM_ROLEDESC;
          this.HeaderText= "Edit -" +' '+  data[0].OPTM_ROLEID; 
          data.forEach(function (SavedData) {
            var Permission = SavedData.OPTM_PERMISSION.split(",");
           
            var AddSelected = false;
            var UpdateSelected = false;
            var DeleteSelected = false;
            var ReadSelected = false;
            for (var iPermissionIndex = 0; iPermissionIndex < Permission.length; iPermissionIndex++) {
                if (Permission[iPermissionIndex] == "A")
                    AddSelected = true;
                else if (Permission[iPermissionIndex] == "U")
                    UpdateSelected = true;
                else if (Permission[iPermissionIndex] == "D")
                    DeleteSelected = true;
                else if (Permission[iPermissionIndex] == "R")
                    ReadSelected = true;
            }

           // this.NewSelectedRowData.push({
            NewSelectedRowData.push({
                OPTM_PROD: SavedData.OPTM_PROD,
                OPTM_MENUID: SavedData.OPTM_MENUID,
                AddSelected: AddSelected,
                UpdateSelected: UpdateSelected,
                DeleteSelected: DeleteSelected,
                ReadSelected: ReadSelected
            });
            //this.NewSelectedRowData=TempSelectedRowData;
        });
        this.NewSelectedRowData = NewSelectedRowData;
        this.model.Product=this.NewSelectedRowData[0].OPTM_PROD;
        this.FillFridOnDropdownSelectedIndexChanged(this.NewSelectedRowData[0].OPTM_PROD);
        this.IsRoleDesc=true ;
        this.IsProduct=true;
        this.enableSubmit=false;
        this.enableEdit=false;
        this.enableDelete=false;
        this.enableUpdate=true;
        this.enableDelete=true;
        this.EditMode=true
        });  
       
  }
   

        UpdateData (Type) {
        //  var oModel = oCurrentController.getView().getModel();

          //Check if the Source is empty or not
         
                  //Check if TableDataBinding array is present or not
                  if (this.gridData1 != null) {
                      // Check if TableDataBinding array have any record 
                      if (this.gridData1.length > 0) {
                         // var sCurrentProductSelected = oCurrentController.getView().byId("cmbxProductId").getValue();
                          // row count of SelectedRowData
                          var iSelectedTbl;
                          //Set Checked Value 
                          // Remove Rows of current selected Product
                          var sCurrentProductSelected = this.model.Product;
                          for (iSelectedTbl = 0; iSelectedTbl < this.NewSelectedRowData.length; iSelectedTbl++) {
                              if (this.NewSelectedRowData[iSelectedTbl].OPTM_PROD == sCurrentProductSelected) {
                                this.NewSelectedRowData.splice(iSelectedTbl, 1);
                                  iSelectedTbl = iSelectedTbl - 1;
                              }

                          }
                          // Remove all unchecked Rows
                          for (iSelectedTbl = 0; iSelectedTbl < this.NewSelectedRowData.length; iSelectedTbl++) {
                              if (this.NewSelectedRowData[iSelectedTbl].AddSelected != true && this.NewSelectedRowData[iSelectedTbl].UpdateSelected != true &&
                                this.NewSelectedRowData[iSelectedTbl].DeleteSelected != true &&
                                this.NewSelectedRowData[iSelectedTbl].ReadSelected != true) {

                                  this.NewSelectedRowData.splice(iSelectedTbl, 1);
                                  iSelectedTbl = iSelectedTbl - 1;
                              }

                          }
                          // row count of TableDataBinding
                          var iTblCount = 0;
                          var iSelectedTbl :any;
                          // row count of SelectedRowData
                           iSelectedTbl = this.NewSelectedRowData.length;
                          // For each loop of all screens of a Product
                          for (iTblCount = 0; iTblCount < this.gridData1.length; iTblCount++) {

                              if (this.gridData1[iTblCount].AddSelected == true || this.gridData1[iTblCount].UpdateSelected == true || this.gridData1[iTblCount].DeleteSelected == true || this.gridData1[iTblCount].ReadSelected == true) {
                                  // Select row of TableDataBinding if any checkbox is checked
                                  this.NewSelectedRowData[iSelectedTbl] = this.gridData1[iTblCount];
                                  // increase index value of SelectedRowData
                                  iSelectedTbl = iSelectedTbl + 1;
                              }
                          }
                      }
                  }
                  this.Loading=true;
            this.RoleService.UpdateUserRole(this.model,this.NewSelectedRowData).subscribe(    
                data => {    
                    
                  if(data=="True")  
                    {   
                    this.NewSelectedRowData=[];  
                     this.FillGridData();
                     this.addRolesScreenToggle('');
                     if(Type==='Cancel')
                     this.confirmationEditToggle();
                    
                     this.gridData1.length=0;
                     this.MessageService.successmessage(this.translate.instant('RecordUpdate'));
                     this.Loading=false;
                    }    
                    else{ this.MessageService.errormessage(data);
                      this.Loading=false;    
                    }    
                  },    
                  error => {
                    this.MessageService.errormessage(error.message);   
                    this.Loading=false;    
                  });
      }  
     
        DeleteData()
          {
            this.Loading=true;    
            this.RoleService.DeleteUserRole(this.model).subscribe(    
              data => {    
                  
                if(data=="True")
                  {
                  this.confirmationOpened=false;     
                   this.FillGridData();
                   this.addRolesScreenToggle('');
                   this.gridData1.length=0;
                   this.MessageService.successmessage(this.translate.instant('RecordDelete'));
                   this.Loading=false;    
                  }    
                  else{ this.MessageService.errormessage(data);  
                    this.Loading=false;      
                  }    
                },    
                error => {
                  this.MessageService.errormessage(error.message); 
                  this.Loading=false;      
                });
          }
          public confirmationToggle() {
   
            this.confirmationOpened = !this.confirmationOpened;
            
          }
          CancelData()
          {
         
            if(this.EditMode)
            {
              
              this.confirmationEditToggle();
              //this.dialougeToggle();
            }
            else this.addRolesScreenToggle('');
          }
}
