import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menuShow: boolean = true;
  navList:any;

  selectedItem :string ="";
  constructor(private translate: TranslateService, private httpClientSer: HttpClient) { 
    //this.setSelectableSettings();
    translate.use(localStorage.getItem('applang'));
    translate.onLangChange.subscribe((event: LangChangeEvent) => { 
    }); 
  }
  ngOnInit() { 
    this.navList = [  
      { "itemName": this.translate.instant('User_Group'), "itemNav": "/main/user-group", "itemIcon": "#userGroup", "itemIconSize": "0 0 512 512", "permission":true},
      { "itemName": this.translate.instant('User_Management'), "itemNav": "/main/user-management", "itemIcon": "#userManagement", "itemIconSize": "0 -8 480 480", "permission":true},
      { "itemName": this.translate.instant('Roles'), "itemNav": "/main/roles", "itemIcon": "#role", "itemIconSize": "0 0 512.24328 512", "permission":true},
      { "itemName": this.translate.instant('Authorization'), "itemNav": "/main/authorization", "itemIcon": "#security", "itemIconSize": "-38 0 511 511.99956", "permission":true},
      { "itemName": this.translate.instant('Connected_Users'), "itemNav": "/main/connected-users", "itemIcon": "#connectedUsers", "itemIconSize": "0 0 512.001 512.001", "permission":true},
      { "itemName": this.translate.instant('Tenant'), "itemNav": "/main/tenant", "itemIcon": "#tenant", "itemIconSize": "0 0 464 464", "permission":true},

      
    ];
  }

  // Close sidebar when siderbar item clicked in case of mobile/tablet devices
  public sidebarCloseMobile(): void {
    if(window.innerWidth <= 991){
      document.getElementById("sidebar-wrapper").classList.remove("toggle");
    }
  }

}