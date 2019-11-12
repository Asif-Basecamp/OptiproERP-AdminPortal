import { Component, OnInit } from '@angular/core';
import { GridComponent, SelectableSettings, RowArgs } from '@progress/kendo-angular-grid';
import { RoleService } from '../../service/role.service'; 
import { MessageService } from '../../common/message.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  //public SelectedRowData:any[];
  public enableSubmit= false;
  public enableEdit = false;
  public enableUpdate= false;
  public enableDelete = false;
  public IsRoleId= true;
  public IsRoleDesc = true;
  public IsProduct= true;
  public confirmationOpened = false;
  //public TableDataBinding: any[]=[];
  constructor(private RoleService:RoleService,private MessageService:MessageService,
    private translate: TranslateService, private httpClientSer: HttpClient) { 
      // let userLang = navigator.language.split('-')[0];
      //     userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
          translate.use(localStorage.getItem('applang'));
          translate.onLangChange.subscribe((event: LangChangeEvent) => { 
          }); 
    
  }

  ngOnInit() {
     this.FillGridData();
    
   // this.gridData = products;
    // this.isMobile();
  }

  onFilterChange(checkBox:any,grid:GridComponent){
    if(checkBox.checked==false){
      this.clearFilter(grid);
    }
  }
   //To get all screen list after product selection
   FillFridOnDropdownSelectedIndexChanged  (ProductName) {
    debugger
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
                      console.log(this.NewSelectedRowData);
                      debugger
                      if(ProductName ==='')
                        {
                          ProductName=this.model.Product;
                          ProductName='';
                        }
    this.RoleService.FillFridOnDropdownSelectedIndexChanged(ProductName).subscribe(    
      data => { 
      
        if(data.length > 0)  
        {  
         // this.CheckUncheckValueInsideFrid(data);   
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
                   
        }    
        else{    
          this.gridData1 = [];
         //this.MessageService.errormessage(this.translate.instant('Somethingwrong'));
        }    
      },    
      error => {    
        this.MessageService.errormessage(error.message);
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
  CheckUncheckValueInsideFrid(data,EditMode)
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
  // FillFridOnDropdownSelectedIndexChanged()
  //   {
  //      this.RoleService.FillFridOnDropdownSelectedIndexChanged(this.model).subscribe(    
  //         data => { 
          
  //           if(data.length > 0)  
  //           {  
  //             this.CheckUncheckValueInsideFrid(data)   
  //              this.GridDataFormanupulation=data;
  //           }    
  //           else{    
  //            this.MessageService.errormessage(this.translate.instant('Somethingwrong'));
  //           }    
  //         },    
  //         error => {    
  //           this.MessageService.errormessage(error.message);
  //         });
  //     };
      
  clearFilter(grid:GridComponent){      
    //grid.filter.filters=[];
  }

  public addRolesScreenToggle() {
    this.addRolesScreen = !this.addRolesScreen;
    
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

  }
  FillGridData()
    {
      this.RoleService.FillGridData().subscribe(    
        data => {    
             
          if(data.length > 0)  
          {   
           this.gridData = data; 
          }    
          else{    
            this.MessageService.errormessage(this.translate.instant('Somethingwrong'));    
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
      
       console.log(this.NewSelectedRowData);
       //if (this.gridData1 != null) {
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
      // var SelectedRowData:any=[];
      // var iTblCount = 0;
      // // row count of SelectedRowData
      // let iSelectedTbl = SelectedRowData.length;
      // // For each loop of all screens of a Product
      // for (iTblCount = 0; iTblCount < gridUser.data.length; iTblCount++) {

      //     if (gridUser.data[iTblCount].AddSelected == true || gridUser.data[iTblCount].UpdateSelected == true || gridUser.data[iTblCount].DeleteSelected == true || gridUser.data[iTblCount].ReadSelected == true) {
      //         // Select row of TableDataBinding if any checkbox is checked
      //         SelectedRowData[iSelectedTbl] =gridUser.data[iTblCount];
      //         // increase index value of SelectedRowData
      //         iSelectedTbl = iSelectedTbl + 1;
      //     }
      // }
       if(this.NewSelectedRowData.length==0)  
        {
          this.MessageService.errormessage(this.translate.instant('NoRows')); 
          return
        }
        debugger
        console.log(this.NewSelectedRowData);
      this.RoleService.AddUserRole(this.model,this.NewSelectedRowData).subscribe(    
          data => {    
              
            if(data=="True")   
            {     
              this.FillGridData();
              this.addRolesScreenToggle();
             this.gridData1.length=0;
              this.MessageService.successmessage(this.translate.instant('RecordCreated'));
              
            }    
              else{ this.MessageService.errormessage(this.translate.instant('Somethingwrong'));    
              }    
            },    
            error => {
              this.MessageService.errormessage(error.message);   
            });
     }
     
     gridUserRoleSelectionChange(UserRole,selection) {
     debugger
     var NewSelectedRowData = [];
      this.RoleService.GetDataByRoleId(selection.selectedRows[0].dataItem.OPTM_ROLEID).subscribe(    
        data => {   
          console.log()
          this.addRolesScreenToggle();
           this.model.PriviousRoleId=selection.selectedRows[0].dataItem.OPTM_ROLEID;
          this.model.RoleId=selection.selectedRows[0].dataItem.OPTM_ROLEID;
          this.model.RoleDesc=selection.selectedRows[0].dataItem.OPTM_ROLEDESC;
          this.HeaderText= "Edit -" +' '+  data[0].OPTM_ROLEID;         
          //           data.forEach((SavedData) => { // foreach statement 
          //           this.model.Product=SavedData.OPTM_PROD;
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
        });  
        // this.model.PriviousRoleId=selection.selectedRows[0].dataItem.OPTM_ROLEID;
        // this.model.RoleId=selection.selectedRows[0].dataItem.OPTM_ROLEID;
        // this.model.RoleDesc=selection.selectedRows[0].dataItem.OPTM_ROLEDESC;
        
       
          // if (modelSource != null) {
          //     if (modelSource.oData != null) {
          //         oLinkedModel.SelectedRowData = [];
          //         oLinkedModel.RoleId = modelSource.oData[0].OPTM_ROLEID;
          //         oLinkedModel.RoleDesc = modelSource.oData[0].OPTM_ROLEDESC;
                 
          //       //  var oModel = new JSONModel(oLinkedModel);
          //        // oCurrentController.getView().setModel(oModel);
          //        // oModel.refresh();
          //         //to set the selected product in combo "changes by shashank"
          //        // oCurrentController.getView().byId("cmbxProductId").setSelectedKey(oLinkedModel.SelectedRowData[0].OPTM_PROD);
          //         //to view the product permissions for the selected product
          //         //oCurrentController.onProductChangeForSavedData(oLinkedModel.SelectedRowData[0].OPTM_PROD);
          //     }
          // }
     // });
  }
    //  gridUserRoleSelectionChange(UserRole,selection)
    //   {
        
    //      this.SelectedRowData=[];
    //       this.addRolesScreenToggle();
    //       this.RoleService.GetDataByRoleId(selection.selectedRows[0].dataItem.OPTM_ROLEID).subscribe(    
    //       data => {     
    //       this.HeaderText= "Edit -" +' '+  data[0].OPTM_ROLEID;         
    //           data.forEach((SavedData) => { // foreach statement 
    //           this.model.Product=SavedData.OPTM_PROD;
    //           var Permission = SavedData.OPTM_PERMISSION.split(",");
    //           this.AddSelected = false;
    //           this.UpdateSelected = false;
    //           this.DeleteSelected = false;
    //           this.ReadSelected = false;
    //             for (var iPermissionIndex = 0; iPermissionIndex < Permission.length; iPermissionIndex++) {
                        
    //               if (Permission[iPermissionIndex] == "A")
    //                   this.AddSelected = true;
    //               else if (Permission[iPermissionIndex] == "U")
    //                   this.UpdateSelected = true;
    //               else if (Permission[iPermissionIndex] == "D")
    //                   this.DeleteSelected = true;
    //               else if (Permission[iPermissionIndex] == "R")
    //                   this.ReadSelected = true;
    //           }
    //           this.SelectedRowData.push({
    //             OPTM_PROD: SavedData.OPTM_PROD,
    //             OPTM_MENUID: SavedData.OPTM_MENUNAME,
    //             AddSelected: this.AddSelected,
    //             UpdateSelected: this.UpdateSelected,
    //             DeleteSelected: this.DeleteSelected,
    //             ReadSelected: this.ReadSelected
    //           });
    //             })

    //             this.RoleService.FillFridOnDropdownSelectedIndexChanged(this.model).subscribe(    
    //               data => { 
    //                 if(data.length>0)   
    //                 { 
    //                   this.SelectedRowData.forEach((SavedData) => { // foreach statement 
    //                     var MenuId = SavedData.OPTM_MENUID
    //                     for(let i=0; i<data.length; i++)
    //                     {
    //                       if(MenuId==data[i].ScreenName){
    //                      data[i].AddSelected =SavedData.AddSelected; 
    //                      data[i].UpdateSelected =SavedData.UpdateSelected;
    //                      data[i].DeleteSelected =SavedData.DeleteSelected;
    //                      data[i].ReadSelected =SavedData.ReadSelected;
    //                    }                   
    //                     } 
    //                   })
    //                   this.model.PriviousRoleId=selection.selectedRows[0].dataItem.OPTM_ROLEID;
    //                   this.model.RoleId=selection.selectedRows[0].dataItem.OPTM_ROLEID;
    //                   this.model.RoleDesc=selection.selectedRows[0].dataItem.OPTM_ROLEDESC;
                      
    //                     this.CheckUncheckValueInsideFrid(data);
    //                     this.GridDataFormanupulation=data;
    //                     // this.IsRoleId=false;
    //                     // this.IsRoleDesc=false ;
    //                     // this.IsProduct=false;
    //                     this.IsRoleId=true;
    //                     this.IsRoleDesc=true ;
    //                     this.IsProduct=true;
    //                     this.enableEdit=true;
    //                     this.enableDelete=true;
    //                    this.enableSubmit=false;
    //                    this.enableUpdate=true;
                       
    //                 } 
                    
    //                 else{    
    //                  this.MessageService.errormessage(this.translate.instant('Somethingwrong'));
    //                 } 
    //               },    
    //               error => {
    //                 this.MessageService.errormessage(error.message);   
    //               });
            
    //       },    
    //       error => {
    //         this.MessageService.errormessage(error.message);   
    //       });
    //   }

    EditData()
        {
          let RoleId=this.model.RoleId;
          
          this.RoleService.chkIfGroupIdisAssociate(RoleId).subscribe(    
            data => { 
              
              if(data.length > 0) 
                {
                  if(data[0].ROLEIDCOUNT==0)
                    {
                      this.IsRoleId=true;
                    }
                  else
                    {
                      this.IsRoleId=false;
                    }  
                  }    
              else{    
                    this.MessageService.errormessage(this.translate.instant('Somethingwrong'));
                  }    
                      },    
                error => {    
                  this.MessageService.errormessage(error.message);
                    });
                  this.IsRoleDesc=true ;
                  this.IsProduct=true;
                  this.enableSubmit=false;
                  this.enableEdit=false;
                  this.enableDelete=false;
                  this.enableUpdate=true;
        }

      UpdateData(gridUser)
        {
          
           const RoleId=this.model.RoleId;
           this.onChange(RoleId);

          //  var SelectedRowData:any=[];
          //   var iTblCount = 0;
          //   // row count of SelectedRowData
          //   let iSelectedTbl = SelectedRowData.length;
          //   // For each loop of all screens of a Product
          //   for (iTblCount = 0; iTblCount < gridUser.data.length; iTblCount++) {

          //       if (gridUser.data[iTblCount].AddSelected == true || gridUser.data[iTblCount].UpdateSelected == true || gridUser.data[iTblCount].DeleteSelected == true || gridUser.data[iTblCount].ReadSelected == true) {
          //           // Select row of TableDataBinding if any checkbox is checked
          //           SelectedRowData[iSelectedTbl] =gridUser.data[iTblCount];
          //           // increase index value of SelectedRowData
          //           iSelectedTbl = iSelectedTbl + 1;
          //       }
          //   }
            
          //   this.RoleService.UpdateUserRole(this.model,SelectedRowData).subscribe(    
          //       data => {    
                    
          //         if(data=="True")  
          //           {     
          //            this.FillGridData();
          //            this.addRolesScreenToggle();

                    
          //            this.gridData1.length=0;
          //            this.MessageService.successmessage(this.translate.instant('RecordUpdate'));
          //           }    
          //           else{ this.MessageService.errormessage(data);    
          //           }    
          //         },    
          //         error => {
          //           this.MessageService.errormessage(error.message);   
          //         });
        }
        DeleteData()
          {
            
            this.RoleService.DeleteUserRole(this.model).subscribe(    
              data => {    
                  
                if(data=="True")
                  {
                  this.confirmationOpened=false;     
                   this.FillGridData();
                   this.addRolesScreenToggle();
                   this.gridData1.length=0;
                   this.MessageService.successmessage(this.translate.instant('RecordDelete'));
                  }    
                  else{ this.MessageService.errormessage(data);    
                  }    
                },    
                error => {
                  this.MessageService.errormessage(error.message);   
                });
          }
          public confirmationToggle() {
   
            this.confirmationOpened = !this.confirmationOpened;
            
          }
}
