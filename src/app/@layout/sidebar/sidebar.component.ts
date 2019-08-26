import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menuShow: boolean = true;
  navList:any;

  constructor() {
  }

  ngOnInit() {
    this.navList = [  
      { "itemName": "User Group", "itemNav": "/main/user-group", "itemIcon": "#userGroup", "itemIconSize": "0 0 512 512", "permission":true},
      { "itemName": "User Managment", "itemNav": "/main/user-management", "itemIcon": "#userManagement", "itemIconSize": "0 -8 480 480", "permission":true},
      { "itemName": "Roles", "itemNav": "/main/roles", "itemIcon": "#role", "itemIconSize": "0 0 512.24328 512", "permission":true},
      { "itemName": "Authorization", "itemNav": "/main/authorization", "itemIcon": "#security", "itemIconSize": "-38 0 511 511.99956", "permission":true},
      { "itemName": "Connected Users", "itemNav": "/main/connected-users", "itemIcon": "#connectedUsers", "itemIconSize": "0 0 512.001 512.001", "permission":true},
      // { "defaultUrl": "/main/accounts", "itemName": "Accounts", "itemNav": '', "itemModal": false, "itemIcon": "#account", "itemIconSize": "0 0 512 512","permission":true, 
      //             "subMenu":[{"itemName":"All Accounts","itemNav":"/main/accounts", "itemModal": false, "permission":true},
      //                       {"itemName":"Account Life Cycle","itemNav":"/main/accounts/lifecycle", "itemModal": false, "permission":true}]}
      
    ];
  }

  // Close sidebar when siderbar item clicked in case of mobile/tablet devices
  public sidebarCloseMobile(): void {
    if(window.innerWidth <= 991){
      document.getElementById("sidebar-wrapper").classList.remove("toggle");
    }
  }

}
